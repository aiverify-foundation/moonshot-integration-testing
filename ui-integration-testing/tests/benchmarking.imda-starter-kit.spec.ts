import {Page, test} from '@playwright/test';
import {expect} from "@playwright/test";
import dotenv from 'dotenv';
import path from 'path';

// import {
//     configure_chatgpt4o, 
//     configure_llamaguard, 
//     create_and_select_azureGPT4o_endpoint, 
//     fill_runner_name, 
//     generateRandomName, 
//     checkCookbookInReport} from './benchmarking.spec';

// Read from ".env" file.
const __dirname: string = '.'
dotenv.config({path: path.resolve(__dirname, '.env')});

export async function create_endpoint_steps(page, name, uri, token, connectorType, maxCallPerSec, maxConcurr, model, otherParams, uriSkipCheck?: boolean) {
    await page.goto('http://localhost:3000/endpoints/new');
    await page.getByPlaceholder('Name of the model').click();
    await page.getByPlaceholder('Name of the model').fill(name);
    await page.locator('.aiv__input-container').click();
    await page.getByRole('option', {name: connectorType, exact: true}).click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill(uri);
    await page.getByPlaceholder('Model of the model endpoint').click();
    await page.getByPlaceholder('Model of the model endpoint').fill(model);
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill(token);
    await page.getByText('More Configs').click();
    if (maxCallPerSec != '') {
        const maxCallPerSecDropDownLocator = page.locator('.aiv__input-container')
        await maxCallPerSecDropDownLocator.first().click();
        await page.getByRole('option', {name: maxCallPerSec}).click();
        const dropdownLocator = page.locator('div.dropdown-selector'); // Your dropdown selector
        await maxCallPerSecDropDownLocator.locator('text="' + maxCallPerSec + '"'); // The specific option

    }
    if (maxConcurr != '') {
        const maxConcurrDropDownLocator = page.locator('div:nth-child(2) > label > .css-fyq6mk-container > .aiv__control > .aiv__value-container > .aiv__input-container')
        await maxConcurrDropDownLocator.click();
        await maxConcurrDropDownLocator.locator('text="' + maxConcurr + '"'); // The specific option
    }
    await page.getByPlaceholder('Additional parameters').click();
    await page.getByPlaceholder('Additional parameters').fill(otherParams);
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Save'}).click();

    //Verify Expected redirection
    await expect.soft(page).toHaveURL(new RegExp('^http://localhost:3000/endpoints'));
    //Verify Endpoint Created Successfully
    await page.getByRole('link', {name: name}).click();
    await expect(page.locator('h3')).toHaveText(name, {timeout: 600000})
    if (uriSkipCheck == false) {
        if (uri != '') {
            await expect(page.getByText('uri', {exact: true})).toBeVisible();
        } else {
            await expect(page.getByText('Not set').first()).toBeVisible();
        }
    }
    if (maxCallPerSec != '') {
        await page.getByText(maxCallPerSec, {exact: true}).isVisible();
    } else {
        await expect(page.getByText('10', {exact: true})).toBeVisible();
    }
    if (maxConcurr != '') {
        await expect(page.getByText(maxConcurr, {exact: true})).toBeVisible();
    } else {
        await expect(page.getByText('1', {exact: true})).toBeVisible()
    }
    // Check for display of addtional parameters @ http://localhost:3000/endpoints page
    await expect(page.locator('pre')).toContainText(otherParams);

}

// export async function create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME) {
//     // Benchmarking
//     console.log('Benchmarking')
//     await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
//     await page.getByRole('listitem').nth(1).click();
//     await page.getByRole('button', {name: 'Start New Run'}).click();
//     await page.getByLabel('Select ' + ENDPOINT_NAME).check();
//     await page.getByLabel('Next View').click();
//     await page.getByRole('button', { name: 'Capability' }).click();
//     await page.getByLabel('Select singapore-context').check();
//     await page.getByLabel('Next View').click();
//     await page.getByPlaceholder('Give this session a unique').click();
//     await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
//     await page.getByRole('button', {name: 'Run'}).click();
// }

// export async function download_validation_steps(page) {
//     // Benchmarking
//     console.log('Download Validation')
//     const downloadPromise = page.waitForEvent('download');
//     await page.getByRole('button', {name: 'Download Report'}).click();
//     const download = await downloadPromise;
// }

// Use this to configure chatgpt4o endpoint when they are required by the various recipes/cookbooks when they need llm-as-a-judge or embedding model
// You cannot use this if multiple cookbooks/buttons for configuring the endpoint
export async function configure_chatgpt4o(page,token) {
    // Benchmarking
    console.log('configure_chatgpt4o')
    await page.locator('div').filter({ hasText: /^My OpenAI GPT4oConfigure$/ }).getByRole('button', { name: 'Configure' }).click();
    await page.getByRole('textbox', { name: 'Token*' }).click();
    await page.getByRole('textbox', { name: 'Token*' }).fill(token);
    await page.getByRole('button', { name: 'Save' }).click();
}

// Use this to configure llamaguard endpoint when they are required by the various recipes/cookbooks when they need llm-as-a-judge or embedding model
// You cannot use this if multiple cookbooks/buttons for configuring the endpoint
export async function configure_llamaguard(page,token) {
    // Benchmarking
    console.log('configure_llamaguard')
    await page.locator('div').filter({ hasText: /^Together Llama Guard 8B AssistantConfigure$/ }).getByRole('button', { name: 'Configure' }).click();
    await page.getByRole('textbox', { name: 'Token*' }).click();
    await page.getByRole('textbox', { name: 'Token*' }).fill(token);
    await page.getByRole('button', { name: 'Save' }).click();
}

export async function create_and_select_azureGPT4o_endpoint(page, endpointName) {
    console.log('Benchmarking')
    await create_endpoint_steps(page, endpointName, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + endpointName).check();
    await page.getByLabel('Next View').click();
}

//Filling out the runner name as well as running the test with the default percentage of prmpts which is 1%
export async function fill_runner_name(page, runnerName, promptNumber) {
    await page.getByRole('button', { name: 'Next View' }).click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(runnerName);
    // await expect(page.locator('p:has-text("Number of prompts that will be run:")').getByText(promptNumber.toString())).toBeVisible();
    await page.getByRole('button', {name: 'Run'}).click();
}

export function generateRandomName(prefix: string): string {
    return `${prefix} ${Math.floor(Math.random() * 1000000000)}`;
}

export async function checkCookbookInReport(page: Page, cookbookName: string){
    await expect(page.getByRole('heading', { name: cookbookName })).toBeVisible();
    await expect(
        page.locator('div').filter({ hasText: /^Overall rating:-$/ })
        ).toHaveCount(0);}


//undesirable content
// Currently skipped due to the test being both too long and using too many tokens. 1% is 1990 prompts.
test.skip('test_benchmarking_one_endpoint_cookbook_undesirable-content', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = generateRandomName("Azure OpenAI");
    const RUNNER_NAME: string = generateRandomName("Test Undesirable Content");
    const COOKBOOK_NAME: string = "Undesirable Content";
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    await create_and_select_azureGPT4o_endpoint(page, ENDPOINT_NAME);
    //Select Cookbooks
    await page.getByRole('button', { name: 'IMDA Starter Kit' }).click();
    await expect(
        page.getByRole('listitem')
        .filter({ hasText: COOKBOOK_NAME })
        .getByText('199143 prompts')
    ).toBeVisible();
    await page.getByRole('checkbox', { name: 'Select undesirable-content' }).check();
    await page.getByLabel('Next View').click();
    await configure_chatgpt4o(page,process.env.OPENAI_TOKEN);
    await configure_llamaguard(page,process.env.OPENAI_TOKEN);
    await fill_runner_name(page, RUNNER_NAME, 1991);
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await checkCookbookInReport(page, COOKBOOK_NAME);
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});


//adversarial prompts
test('test_benchmarking_one_endpoint_cookbook_adversarial-prompts', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = generateRandomName("Azure OpenAI");
    const RUNNER_NAME: string = generateRandomName("Test Adversarial Prompts");
    const COOKBOOK_NAME: string = "Adversarial Prompts";
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    await create_and_select_azureGPT4o_endpoint(page, ENDPOINT_NAME);
    //Select Cookbooks
    await page.getByRole('button', { name: 'IMDA Starter Kit' }).click();
    await expect(
        page.getByRole('listitem')
        .filter({ hasText: COOKBOOK_NAME })
        .getByText('251 prompts')
    ).toBeVisible();
    await page.getByRole('checkbox', { name: 'Select adversarial-attacks' }).check();
    await page.getByLabel('Next View').click();
    await configure_chatgpt4o(page,process.env.OPENAI_TOKEN);
    await fill_runner_name(page, RUNNER_NAME, 2);
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await checkCookbookInReport(page, COOKBOOK_NAME);
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});




//data disclosure
test('test_benchmarking_one_endpoint_cookbook_data-disclosure', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = generateRandomName("Azure OpenAI");
    const RUNNER_NAME: string = generateRandomName("Test Data Disclosure");
    const COOKBOOK_NAME: string = "Data Disclosure";
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    await create_and_select_azureGPT4o_endpoint(page, ENDPOINT_NAME);
    //Select Cookbooks
    await page.getByRole('button', { name: 'IMDA Starter Kit' }).click();
    await expect(
        page.getByRole('listitem')
        .filter({ hasText: COOKBOOK_NAME })
        .getByText('100 prompts')
    ).toBeVisible();
    await page.getByRole('checkbox', { name: 'Select data-disclosure' }).check();
    await page.getByLabel('Next View').click();
    await configure_chatgpt4o(page,process.env.OPENAI_TOKEN);
    await fill_runner_name(page, RUNNER_NAME, 1);
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await checkCookbookInReport(page, COOKBOOK_NAME);
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

//hallucination
test('test_benchmarking_one_endpoint_cookbook_hallucination', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = generateRandomName("Azure OpenAI");
    const RUNNER_NAME: string = generateRandomName("Test Hallucination");
    const COOKBOOK_NAME: string = "Hallucination";
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    await create_and_select_azureGPT4o_endpoint(page, ENDPOINT_NAME);
    //Select Cookbooks
    await page.getByRole('button', { name: 'IMDA Starter Kit' }).click();
    await expect(
        page.getByRole('listitem')
        .filter({ hasText: COOKBOOK_NAME })
        .getByText('17763 prompts')
    ).toBeVisible();
    await page.getByRole('checkbox', { name: 'Select hallucination' }).check();
    await fill_runner_name(page, RUNNER_NAME, 181);
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await checkCookbookInReport(page, COOKBOOK_NAME);
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});
