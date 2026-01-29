import {Page, test} from '@playwright/test';
import {expect} from "@playwright/test";
// import {create_endpoint_steps} from './endpoint.spec';
import dotenv from 'dotenv';
import path from 'path';
import fs from "fs/promises";
// Read from ".env" file.
const __dirname: string = '.'
dotenv.config({path: path.resolve(__dirname, '.env')});

const COOKBOOK_SINGAPORE_CONTEXT_ONE_PCT_PROMPT_TEXT: string = 'Number of prompts to run:7'

function get_unique_number() {
    return Math.floor(Math.random() * 1000000000);
}

function get_together_mistral_endpoint_unique_name() {
    return "Test " + "Together Mistral 7B Instruct " + get_unique_number();
}

function get_runner_unique_name(name_prefix: string) {
    return name_prefix + " " + get_unique_number();
}

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

export async function create_single_together_mistral_7b_instruct_endpoint(page, ENDPOINT_NAME) {
    await create_endpoint_steps(
        page, 
        ENDPOINT_NAME, 
        '', 
        process.env.TOGETHER_TOKEN, 
        'together-connector', 
        '2', 
        '', 
        'mistralai/Mistral-7B-Instruct-v0.3', 
        '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', 
        true
    )
}

export async function create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME) {
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
}


export async function download_validation_steps(page) {
    // Benchmarking
    console.log('Download Validation')
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', {name: 'Download Report'}).click();
    const download = await downloadPromise;
}

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

test('test_benchmarking_one_endpoint_run_with_percentage_check', async ({browserName, page}) => {
    test.setTimeout(1200000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME)
    // Locate the element
    const locator = page.locator('p.text-white.text-\\[1\\.1rem\\].w-\\[90\\%\\]');

    // Poll for the text content to change from "0%" to "100%"
    let currentText = await locator.textContent();

    // Loop until the text becomes "100%"
    while (currentText !== '100%') {
        console.log(`Current percentage: ${currentText}`); // Log progress (optional)

        // Wait for a short time before checking again (e.g., 500ms)
        await page.waitForTimeout(500);

        // Get the updated text content
        currentText = await locator.textContent();
    }

    // Once it reaches "100%", execute some action
    console.log('Reached 100%, executing action...');
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText(COOKBOOK_SINGAPORE_CONTEXT_ONE_PCT_PROMPT_TEXT)).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)


    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_slider_percentage', async ({browserName, page}) => {
    test.setTimeout(1200000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    //Start Benchmarking
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);


    // Get the bounding box of the slider track
    const sliderTrack = page.locator('.Slider_slider__3olqj'); // Update with the slider's track selector
    const sliderBox = await sliderTrack.boundingBox();
    if (!sliderBox) {
        throw new Error('Could not retrieve slider bounding box.');
    }

    // Drag the slider handle to the middle of the slider by simulating mouse events
    const roundingErrorInPixels = 5;  // Trial and error to get from 49% to 50%
    const slider50PctOffsetWidth = sliderBox.width * 0.5 + roundingErrorInPixels;
    const sliderHandle = page.locator('.Slider_handle__AaqrC'); // Update with the actual selector of your slider handle
    await sliderHandle.dragTo(sliderHandle, {
        force: true,
        targetPosition: {
            x: slider50PctOffsetWidth, 
            y: 0,
        },
    });
    await expect(page.getByText('50%')).toBeVisible();  // Check if 50% of prompts is selected

    await page.getByRole('button', {name: 'Run'}).click();
    //////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();

    await expect(page.getByText('Number of prompts to run:137')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint', async ({browserName, page}) => {
    test.setTimeout(1200000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME)
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText(COOKBOOK_SINGAPORE_CONTEXT_ONE_PCT_PROMPT_TEXT)).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_cookbook_common-risk-easy', async ({browserName, page}) => {
    test.setTimeout(1200000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = 'Test Together Mistral 7B Instruct 214294263';
    const ENDPOINT_ID: string = ENDPOINT_NAME.replaceAll(' ', '-').toLowerCase();
    const RUNNER_NAME: string = get_runner_unique_name("Test Common Risk Easy");
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await create_single_together_mistral_7b_instruct_endpoint(page, ENDPOINT_NAME);
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select common-risk-easy').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 900000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:944')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)

    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results for' + ENDPOINT_ID}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_one_endpoint_cookbook_singapore-context', async ({browserName, page}) => {
    test.setTimeout(1200000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test Facts About Singapore " + Math.floor(Math.random() * 1000000000);
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Detailss
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText(COOKBOOK_SINGAPORE_CONTEXT_ONE_PCT_PROMPT_TEXT)).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_cookbook_medical-llm-leaderboard', async ({browserName, page}) => {
    test.setTimeout(3000000);
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    
    const ENDPOINT_NAME: string = get_together_mistral_endpoint_unique_name();
    const ENDPOINT_ID: string = ENDPOINT_NAME.replaceAll(' ', '-').toLowerCase();
    const RUNNER_NAME: string = get_runner_unique_name("Test Medical");

    // Create an unique endpoint for this test
    await create_single_together_mistral_7b_instruct_endpoint(page, ENDPOINT_NAME)
    
    // Run benchmark test
    console.log('Benchmarking')
    await page.getByRole('listitem').nth(1).click();  // Benchmarking icon on left nav bar
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();  // Select cookbook category
    await page.getByLabel('Select medical-llm-leaderboard').check();  // Select cookbook
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    
    // Wait for benchmark test to complete to display report button
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 2100000})

    // Validate Details overlay panel
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:1947')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();  // Click on 'X' image to close panel
    
    // Validate Report Page
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: "Showing results for" + ENDPOINT_ID}).getByRole('link').first().click();
    // await download_validation_steps (page)
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_one_endpoint_cookbook_leaderboard-cookbook', async ({browserName, page}) => {
    test.setTimeout(2100000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = get_together_mistral_endpoint_unique_name();
    const ENDPOINT_ID: string = ENDPOINT_NAME.replaceAll(' ', '-').toLowerCase();
    const RUNNER_NAME: string = get_runner_unique_name("Test Leaderboard");
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await create_single_together_mistral_7b_instruct_endpoint(page, ENDPOINT_NAME);

    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select leaderboard-cookbook').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1800000})
    
    // Validate Details overlay panel
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:1256')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)

    // Validate report page
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results for' + ENDPOINT_ID}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_one_endpoint_cookbook_tamil-language-cookbook', async ({browserName, page}) => {
    test.setTimeout(1200000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test Tamil " + Math.floor(Math.random() * 1000000000);
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select tamil-language-cookbook').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Detailss
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:49')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_cookbook_legal-summarisation', async ({browserName, page}) => {
    test.setTimeout(1200000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = get_together_mistral_endpoint_unique_name();
    const ENDPOINT_ID: string = ENDPOINT_NAME.replaceAll(' ', '-').toLowerCase();
    const RUNNER_NAME: string = get_runner_unique_name("Test Legal Summarization");
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    // await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await create_single_together_mistral_7b_instruct_endpoint(page, ENDPOINT_NAME);
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select legal-summarisation').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Detailss
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:665')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results for' + ENDPOINT_ID}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_one_endpoint_cookbook_mlc-ai-safety', async ({browserName, page}) => {
    test.setTimeout(5000000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test MLC " + Math.floor(Math.random() * 1000000000);
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select mlc-ai-safety').check();
    await page.getByLabel('Next View').click();

    //Edit Endpoint
    // const TOGETHER_ENDPOINT_NAME: string = "Together Llama Guard 7B Assistant";
    // await page.locator('li').filter({hasText: TOGETHER_ENDPOINT_NAME + "Added"}).getByRole('button').click();
    await page.getByRole('button', {name: 'Configure'}).click();
    await page.getByPlaceholder('Access token for the remote').fill(process.env.TOGETHER_TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 4000000})
    //Check Detailss
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:426')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_cookbook_common-risk-hard', async ({browserName, page}) => {
    test.setTimeout(5000000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = get_together_mistral_endpoint_unique_name();
    const ENDPOINT_ID: string = ENDPOINT_NAME.replaceAll(' ', '-').toLowerCase();
    const RUNNER_NAME: string = get_runner_unique_name("Test Hard CookBook");
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await create_single_together_mistral_7b_instruct_endpoint(page, ENDPOINT_NAME);

    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select common-risk-hard').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 4000000})
    //Check Detailss
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:944')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results for' + ENDPOINT_ID}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_one_endpoint_cookbook_chinese-safety-cookbook', async ({browserName, page}) => {
    test.setTimeout(1800000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test Clcc " + Math.floor(Math.random() * 1000000000);
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select chinese-safety-cookbook').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1200000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:1127')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});


test('test_benchmarking_with_invalid_endpoint', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, "uri", "token123", 'azure-openai-connector', '2', '', 'gpt-4o', '{\n      "timeout": 300,\n   "max_attempts": 1,\n      "temperature": 0.5\n  }', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill('Test ' + Math.floor(Math.random() * 1000000000));
    await page.getByRole('button', {name: 'Run'}).click();
    // Assert Error Running Benchmarking
    await expect(page.getByRole('button', {name: 'View Errors'})).toBeVisible({timeout: 600000});
    await expect(page.getByText('% (with error)')).toBeVisible();
    await page.getByRole('button', {name: 'View Errors'}).click();
    await expect(page.getByRole('heading', {name: 'Errors'})).toBeVisible();
    await page.getByRole('button', {name: 'Close'}).click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_runner_name_exist', async ({browserName, page}) => {
    test.setTimeout(1200000);
    // Check if the browser is WebKit
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const ENDPOINT_NAME2: string = "Azure OpenAI2 " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME)
    // Run again
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME2, RUNNER_NAME)
    await expect(page.getByText('Unable to create and execute')).toBeVisible();
    await expect(page.getByText('Errors')).toBeVisible();
    await page.getByRole('button', {name: 'Close'}).click();
});

test('test_benchmarking_runner_name_input_integer', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "" + Math.floor(Math.random() * 1000000000);
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME)
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_runner_name_input_decimal', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = Math.floor(Math.random() * 100000) + "." + Math.floor(Math.random() * 100000);
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME)
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_runner_name_input_special_char', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "@" + Math.floor(Math.random() * 100000);
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME)
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});
test('test_benchmarking_runner_name_input_empty', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = ""
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    // await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    // await expect(page.getByText('Name is required')).toBeVisible();
    // Select the Run button
    const runBtn = page.getByRole('button', {name: 'Run'});
    // Check if the Save button is disabled
    await expect(runBtn).toBeDisabled();

});

test('test_benchmarking_runner_description_input_!empty', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByPlaceholder('Description of this benchmark').fill('test');
    await page.getByRole('button', {name: 'Run'}).click();

    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});
test('test_benchmarking_two_endpoint', async ({browserName, page}) => {
    test.setTimeout(1200000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const ENDPOINT_NAME_2: string = "Azure OpenAI 2" + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await create_endpoint_steps(page, ENDPOINT_NAME_2, process.env.URI2, process.env.TOKEN2, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Select ' + ENDPOINT_NAME_2).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill('Test ' + Math.floor(Math.random() * 1000000000));
    await page.getByRole('button', {name: 'Run'}).click();
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    await page.getByRole('button', {name: 'View Report'}).click();

    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_two_endpoint_invalid', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const ENDPOINT_NAME_2: string = "Azure OpenAI 2" + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, "URI", "Token123", 'azure-openai-connector', '2', '', '123', '{\n      "timeout": 300,\n "max_attempts": 3,\n      "temperature": 0.5\n  }', true)
    await create_endpoint_steps(page, ENDPOINT_NAME_2, "URI", "Token123", 'azure-openai-connector', '2', '', '123', '{\n      "timeout": 300,\n    "max_attempts": 3,\n      "temperature": 0.5\n  }', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Select ' + ENDPOINT_NAME_2).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    // Assert Error Running Benchmarking
    await expect(page.getByRole('button', {name: 'View Errors'})).toBeVisible({timeout: 600000});
    await expect(page.getByText('% (with error)')).toBeVisible();
    await page.getByRole('button', {name: 'View Errors'}).click();
    await expect(page.getByRole('heading', {name: 'Errors'})).toBeVisible();
    await page.getByRole('button', {name: 'Close'}).click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_two_endpoint_mixed_valid&invalid', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const ENDPOINT_NAME_2: string = "Azure OpenAI 2" + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await create_endpoint_steps(page, ENDPOINT_NAME_2, "URI", "Token123", 'azure-openai-connector', '2', '', '123', '{\n      "timeout": 300,\n    "max_attempts": 3,\n      "temperature": 0.5\n }', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Select ' + ENDPOINT_NAME_2).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    // Assert Error Running Benchmarking
    await expect(page.getByRole('button', {name: 'View Errors'})).toBeVisible({timeout: 600000});
    await expect(page.getByText('% (with error)')).toBeVisible();
    await page.getByRole('button', {name: 'View Errors'}).click();
    await expect(page.getByRole('heading', {name: 'Errors'})).toBeVisible();
    await page.getByRole('button', {name: 'Close'}).click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_zero_endpoint_selected', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();

    await expect(page.getByRole('heading', {name: 'Select the Endpoint(s) to be'})).toBeVisible();

});

test('test_benchmarking_edit_endpoint_step', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await create_endpoint_steps(page, ENDPOINT_NAME, "URI", process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    //Edit Endpoint
    await page.locator('li').filter({hasText: ENDPOINT_NAME + "Added"}).getByRole('button').click();
    await page.getByPlaceholder('URI of the remote model').fill(process.env.URI);
    await page.getByRole('button', {name: 'Save'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    //////////////////////////////////////////////////
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText(COOKBOOK_SINGAPORE_CONTEXT_ONE_PCT_PROMPT_TEXT)).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_create_new_endpoint_step', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    const CONNECTORTYPE: string = 'azure-openai-connector';
    const TOKEN: string = process.env.TOKEN;
    const URI: string = process.env.URI;
    // Benchmarking
    console.log('Benchmarking')
    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    //Create Endpoint
    await page.getByRole('button', {name: 'Create New Endpoint'}).click();
    await page.getByPlaceholder('Name of the model').fill(ENDPOINT_NAME);
    await page.locator('.aiv__input-container').click();
    await page.getByRole('option', {name: CONNECTORTYPE, exact: true}).click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill(URI);
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill(TOKEN);
    await page.getByPlaceholder('Model of the model endpoint').click();
    await page.getByPlaceholder('Model of the model endpoint').fill('gpt-4o');
    await page.getByText('More Configs').click();
    await page.getByPlaceholder('Additional parameters').fill('{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}');
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Save'}).click();
    console.log('Select ' + ENDPOINT_NAME)
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    //////////////////////////////////////////////////
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText(COOKBOOK_SINGAPORE_CONTEXT_ONE_PCT_PROMPT_TEXT)).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_create_endpoint_entry_point_2', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    const CONNECTORTYPE: string = 'azure-openai-connector';
    const TOKEN: string = process.env.TOKEN;
    const URI: string = process.env.URI;
    // Benchmarking
    console.log('Benchmarking')
    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    //Create Endpoint via another entry point
    await page.locator('li').filter({hasText: 'Testing a new Endpoint?Create'}).click();
    await page.getByPlaceholder('Name of the model').fill(ENDPOINT_NAME);
    await page.locator('.aiv__input-container').click();
    await page.getByRole('option', {name: CONNECTORTYPE, exact: true}).click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill(URI);
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill(TOKEN);
    await page.getByPlaceholder('Model of the model endpoint').click();
    await page.getByPlaceholder('Model of the model endpoint').fill('gpt-4o');
    await page.getByText('More Configs').click();
    await page.getByPlaceholder('Additional parameters').fill('{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}');
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();

    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:7')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_run_with_two_cookbook_standard', async ({browserName, page}) => {
    test.setTimeout(2100000);

    const ENDPOINT_NAME: string = get_together_mistral_endpoint_unique_name();
    const ENDPOINT_ID: string = ENDPOINT_NAME.replaceAll(' ', '-').toLowerCase();
    const RUNNER_NAME: string = get_runner_unique_name("Test Two Cookbooks Standard");

    await create_single_together_mistral_7b_instruct_endpoint(page, ENDPOINT_NAME);

    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await page.getByLabel('Select ' + ENDPOINT_NAME, {exact: true}).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select common-risk-easy').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1800000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:951')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results for' + ENDPOINT_ID}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_run_with_two_cookbook_standard_with_mlc_type', async ({browserName, page}) => {
    test.setTimeout(5000000);
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    test.skip(browserName === 'firefox', 'This test is skipped on WebKit');

    const ENDPOINT_NAME: string = get_together_mistral_endpoint_unique_name();
    const ENDPOINT_ID: string = ENDPOINT_NAME.replaceAll(' ', '-').toLowerCase();
    const RUNNER_NAME: string = get_runner_unique_name("Test two cookbooks with MLC type");

    await create_single_together_mistral_7b_instruct_endpoint(page, ENDPOINT_NAME)

    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    /////////////////////////////////////////////////////////////////////////////////////

    await page.getByLabel('Select ' + ENDPOINT_NAME, {exact: true}).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select mlc-ai-safety').check();

    await page.getByLabel('Next View').click();

    //Edit Endpoint
    // await page.locator('li').filter({hasText: TOGETHER_ENDPOINT_NAME + "Added"}).getByRole('button').click();
    await page.getByRole('button', {name: 'Configure'}).click();
    await page.getByPlaceholder('Access token for the remote').fill(process.env.TOGETHER_TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    // //////////////////////////////////////////////////

    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 4000000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    // await expect(page.getByText('Number of prompts to run:427')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results for' + ENDPOINT_ID}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_run_with_zero_cookbook_step', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME: string = "Azure OpenAI GPT4o";
    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    //Edit Endpoint
    await page.locator('li').filter({hasText: ENDPOINT_NAME + "Added"}).getByRole('button').click();
    await page.getByPlaceholder('URI of the remote model').fill(process.env.URI);
    await page.getByPlaceholder('Access token for the remote').fill(process.env.TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByLabel('Select ' + ENDPOINT_NAME, {exact: true}).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Select singapore-context').uncheck();
    await expect(page.getByLabel('Next View')).toBeDisabled();
});

test('test_benchmarking_run_with_view_past_run_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME_RAND: number = Math.floor(Math.random() * 1000000000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + ENDPOINT_NAME_RAND;
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME)
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:7')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

    await page.locator('#navContainer').getByRole('link').nth(1).click();
    await page.getByRole('button', {name: 'View Past Runs'}).click();
    console.log('azure-openai-' + ENDPOINT_NAME_RAND.toString())

    await page.locator('li').filter({hasText: RUNNER_NAME}).click();
    await expect(page.locator('span', {hasText: 'azure-openai-' + ENDPOINT_NAME_RAND.toString()})).toBeVisible();
    await expect(page.getByRole('listbox').getByRole('heading', {name: RUNNER_NAME})).toBeVisible();
    await expect(page.getByText('singapore-context')).toBeVisible();
    await expect(page.getByText('1', {exact: true})).toBeVisible();
});

test('test_benchmarking_run_with_view_past_run_btn_start_new_run_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const ENDPOINT_NAME_RAND: number = Math.floor(Math.random() * 1000000000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + ENDPOINT_NAME_RAND;
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    const NEW_RUNNER_NAME: string = get_runner_unique_name("Test 2");

    // Create an endpoint and run a benchmark test
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME)
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})

    // Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:7')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();  // Click on "X" button to close Run Details panel

    // Check View Report    
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-openai-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()  // Go back to home page

    // Navigate to Benchmarking -> View Past Runs page
    await page.locator('#navContainer').getByRole('link').nth(1).click();  // Click on "Benchmarking" image link on left nav bar
    await page.getByRole('button', {name: 'View Past Runs'}).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();

    // Create a new run
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(NEW_RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    //Assert if run is success
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
});

test('test_benchmarking_run_with_view_cookbook_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'View Cookbooks'}).click();
    await page.getByPlaceholder('Search by name').click();
    await page.getByPlaceholder('Search by name').fill('Hard');
    await page.locator('li').filter({hasText: 'Hard test sets for Common'}).click();
    await page.locator('div').filter({hasText: /^Hard test sets for Common Risks$/}).nth(1).click();
    await expect(page.getByText('This is a cookbook that').nth(1)).toBeVisible();
    await expect(page.locator('h3')).toContainText('Hard test sets for Common Risks');
    // Assert Run button is hidden
    const footer = page.locator('footer');
    await expect(footer).toBeHidden();
});

test('test_benchmarking_run_with_view_cookbook_btn_select_more_than_one', async ({browserName, page}) => {
    test.setTimeout(1200000);
    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'View Cookbooks'}).click();
    await page.getByPlaceholder('Search by name').click();
    await page.getByPlaceholder('Search by name').fill('singapore');
    await page.getByRole('checkbox', {name: 'Select Facts about Singapore'}).check();
    await page.getByPlaceholder('Search by name').click();
    await page.getByPlaceholder('Search by name').fill('easy');
    await page.getByRole('checkbox', {name: 'Select Easy test sets for'}).check();
    await page.getByRole('button', {name: 'Run'}).click();
    await expect(page.getByRole('heading', {name: 'Select the Endpoint(s) to be'})).toBeVisible();
});

test('test_benchmarking_run_with_view_recipes_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'View Recipes'}).click();
    await page.getByPlaceholder('Search by name').click();
    await page.getByPlaceholder('Search by name').fill('squad');
    await page.locator('li').filter({hasText: 'squad-shifts-tnf'}).click();
    await page.locator('div').filter({hasText: /^squad-shifts-tnf$/}).nth(1).click();
    await expect(page.getByText('Zero-shot reading comprehension').nth(1)).toBeVisible();
    await expect(page.locator('h3')).toContainText('squad-shifts-tnf');
});

test('test_benchmarking_one_endpoint_cookbook_azure_i2p', async ({browserName, page}) => {
    test.setTimeout(2100000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const COOKBOOK_NAME: string = "test-i2p-" + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test AzureAi I2P " + Math.floor(Math.random() * 1000000000);
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(1).click();
    // Create i2p cookbook steps
    await page.getByRole('button', {name: 'View Cookbooks'}).click();
    await page.goto('http://localhost:3000/benchmarking/cookbooks');
    await page.getByRole('button', {name: 'Create New Cookbook'}).click();
    await page.getByPlaceholder('Give this cookbook a unique').click();
    await page.getByPlaceholder('Give this cookbook a unique').fill(COOKBOOK_NAME);
    await page.getByRole('button', {name: 'Select Recipes'}).click();
    await page.getByPlaceholder('Search by name').click();
    await page.getByPlaceholder('Search by name').fill('i2');
    await page.getByLabel('Select I2P').check();
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Create Cookbook'}).click();
    await page.getByRole('button', {name: 'View Cookbooks'}).click();

    //Edit i2p endpoint
    await page.locator('li').filter({hasText: 'benchmarking'}).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();

    const AZURE_DALLE_ENDPOINT_NAME: string = "Azure OpenAI Dall-E";
    await page.locator('li').filter({hasText: AZURE_DALLE_ENDPOINT_NAME + "Added"}).getByRole('button').click();
    // await page.getByPlaceholder('URI of the remote model').fill(process.env.URI);
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill('' + process.env.URI + '');
    await page.getByPlaceholder('Access token for the remote').fill(process.env.TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();

    //////////////////////////////////////////////////
    await page.getByLabel('Select ' + AZURE_DALLE_ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();

    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select ' + COOKBOOK_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1800000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:47')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_cookbook_openai_i2p', async ({browserName, page}) => {
    test.setTimeout(2100000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const COOKBOOK_NAME: string = "test-i2p-" + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test OpenAi I2P " + Math.floor(Math.random() * 1000000000);
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(1).click();
    // Create i2p cookbook steps
    await page.getByRole('button', {name: 'View Cookbooks'}).click();
    await page.goto('http://localhost:3000/benchmarking/cookbooks');
    await page.getByRole('button', {name: 'Create New Cookbook'}).click();
    await page.getByPlaceholder('Give this cookbook a unique').click();
    await page.getByPlaceholder('Give this cookbook a unique').fill(COOKBOOK_NAME);
    await page.getByRole('button', {name: 'Select Recipes'}).click();
    await page.getByPlaceholder('Search by name').click();
    await page.getByPlaceholder('Search by name').fill('i2');
    await page.getByLabel('Select I2P').check();
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Create Cookbook'}).click();
    await page.getByRole('button', {name: 'View Cookbooks'}).click();

    await page.locator('li').filter({hasText: 'benchmarking'}).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();

    //Edit i2p endpoint
    const OPENAI_DALLE_ENDPOINT_NAME: string = "OpenAI Dall-E-2";
    await page.locator('li').filter({hasText: OPENAI_DALLE_ENDPOINT_NAME + "Added"}).getByRole('button').click();
    await page.getByPlaceholder('Access token for the remote').fill("" + process.env.OPENAI_TOKEN + "");
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByLabel('Select ' + OPENAI_DALLE_ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();

    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select ' + COOKBOOK_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1800000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:47')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results foropenai-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_cookbook_amazon_bedrock', { tag: ['@wip'] }, async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(2100000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    await page.goto('http://localhost:3000');
    const ENDPOINT_NAME: string = "Amazon Bedrock - Anthropic Claude 3 Sonnet";
    const RUNNER_NAME: string = "Test Amazon Bedrock " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await page.getByRole('listitem').nth(1).click();
    //Edit Dependency Endpoint
    await page.getByRole('button', {name: 'Start New Run'}).click();

    //Edit Dependency Endpoints
    await page.locator('section').filter({hasText: /^Amazon Bedrock - Anthropic Claude 3 SonnetAdded/}).locator('button').click();
    let otherParams = '{\n' +
        '    "timeout": 300,\n' +
        '    "max_attempts": 3,\n' +
        '    "temperature": 0.5,\n' +
        '    "model": "anthropic.claude-3-sonnet-20240229-v1:0",\n' +
        '    "session": {\n' +
        '        "region_name": "ap-southeast-1"\n' +
        '    }\n' +
        '}'
    await page.getByText('More Configs').click();
    await page.getByPlaceholder('Additional parameters').click();
    await page.getByPlaceholder('Additional parameters').fill(otherParams);
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByLabel('Select Amazon Bedrock - Anthropic Claude 3 Sonnet').check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();

    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1800000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:1')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results foramazon-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});


test('test_benchmarking_one_endpoint_cookbook_cybersec', async ({browserName, page}) => {
    test.setTimeout(1800000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const COOKBOOK_NAME: string = "test-cybersec-" + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test CyberSec " + Math.floor(Math.random() * 1000000000);
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(1).click();
    // Create i2p cookbook steps
    await page.getByRole('button', {name: 'View Cookbooks'}).click();
    await page.goto('http://localhost:3000/benchmarking/cookbooks');
    await page.getByRole('button', {name: 'Create New Cookbook'}).click();
    await page.getByPlaceholder('Give this cookbook a unique').click();
    await page.getByPlaceholder('Give this cookbook a unique').fill(COOKBOOK_NAME);
    await page.getByRole('button', {name: 'Select Recipes'}).click();
    await page.getByPlaceholder('Search by name').click();
    await page.getByPlaceholder('Search by name').fill('prom');
    await page.getByLabel('Select prompt injection').check();
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Create Cookbook'}).click();
    await page.getByRole('button', {name: 'View Cookbooks'}).click();

    //Create Azure endpoint as target model
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    //Edit llm-judge-azure endpoint
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();

    const LLM_JUDGE_AZURE_ENDPOINT_NAME: string = "llm-judge-azure-gpt4-annotator";
    await page.locator('li').filter({hasText: LLM_JUDGE_AZURE_ENDPOINT_NAME + "Added"}).getByRole('button').click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill('' + process.env.URI + '');
    await page.getByPlaceholder('Access token for the remote').fill(process.env.TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByLabel('Select ' + ENDPOINT_NAME).check();
    await page.getByLabel('Next View').click();

    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select ' + COOKBOOK_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1200000})
    //Check Detailss
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:2')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_cookbook_google', async ({browserName, page}) => {
    test.setTimeout(1200000); //set test timeout to 1 hour

    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    await page.goto('http://localhost:3000');
    const RUNNER_NAME: string = get_runner_unique_name("Test Google Gemini");
    // Benchmarking
    console.log('Benchmarking')

    await page.getByRole('listitem').nth(1).click();

////////////////////////////////////////////////
    await page.getByRole('button', {name: 'Start New Run'}).click();
    //Edit Dependency Endpoints
    await page.locator('section').filter({hasText: /^google-gemini-flash-15Added/}).locator('button').click();
    // Replace endpoint default model 'gemini-1.5-flash' with 'gemini-2.5-flash' as it is no longer available
    await page.getByRole('textbox', {name: 'Model'}).click();
    await page.getByRole('textbox', {name: 'Model'}).fill('gemini-2.5-flash');
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill("" + process.env.GOOGLE_TOKEN + "");
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByLabel('Select google-gemini-flash-15').check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();

    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();

    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////

    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1200000})

    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:7')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forgoogle-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_cookbook_llm_judge_openai_gpt4_annotator_bias-occupation', async ({browserName, page}) => {    
    test.setTimeout(3000000);
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');

    const COOKBOOK_NAME: string = get_runner_unique_name("Test Bias Occupation Cookbook");
    const COOKBOOK_ID: string = COOKBOOK_NAME.replaceAll(' ', '-').toLowerCase();
    const RUNNER_NAME: string = get_runner_unique_name("Test Bias Occupation");
    const TARGET_ENDPOINT_NAME: string = get_together_mistral_endpoint_unique_name();
    const TARGET_ENDPOINT_NAME_ID: string = TARGET_ENDPOINT_NAME.replaceAll(' ', '-').toLowerCase();
    const LLM_OPENAI_MODEL_NAME: string = "gpt-4.1";

    // Create i2p cookbook steps
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'View Cookbooks'}).click();
    await page.getByRole('button', {name: 'Create New Cookbook'}).click();
    await page.getByPlaceholder('Give this cookbook a unique').click();
    await page.getByPlaceholder('Give this cookbook a unique').fill(COOKBOOK_NAME);
    await page.getByRole('button', {name: 'Select Recipes'}).click();
    await page.getByPlaceholder('Search by name').click();
    await page.getByPlaceholder('Search by name').fill('bias');
    await page.getByLabel('Select Bias - Occupation').check();
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Create Cookbook'}).click();
    await page.getByRole('button', {name: 'View Cookbooks'}).click();

    // Create Target Endpoint
    await create_single_together_mistral_7b_instruct_endpoint(page, TARGET_ENDPOINT_NAME);

    // Start Benchmark Test
    console.log('Benchmarking')
    await page.goto('http://localhost:3000/');
    await page.getByRole('listitem').nth(1).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    
    // Select Target Endpoint Page
    await page.getByLabel('Select ' + TARGET_ENDPOINT_NAME, {exact: true}).check();
    await page.getByLabel('Next View').click();

    // Select Cookbook Page
    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select ' + COOKBOOK_ID).check();
    await page.getByLabel('Next View').click();

    // Configure Requirements Page - Edit LLM Judge - OpenAI GPT4 Evaluator endpoint
    await page.getByRole('button', {name: 'Configure'}).click();
    await page.getByRole('textbox', {name: 'Model'}).click();
    await page.getByRole('textbox', {name: 'Model'}).fill(LLM_OPENAI_MODEL_NAME);
    await page.getByPlaceholder('Access token for the remote').fill(process.env.OPENAI_TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    await page.getByLabel('Next View').click();

    // Run Page - Set Runner Name
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    // Wait for run to complete for report to be visible
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 2100000})
    
    // Details Overlay Panel
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:72')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)

    // Report Page
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results for' + TARGET_ENDPOINT_NAME_ID}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});

test('test_benchmarking_one_endpoint_cookbook_jailbreak_prompts', async ({browserName, page}) => {
    test.setTimeout(2100000);
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    const COOKBOOK_NAME: string = "test-jailbreak-prompts-" + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test Jailbreak Prompts " + Math.floor(Math.random() * 1000000000);
    ////////////////////////////////////////////////////////////////////////////
    // Benchmarking
    console.log('Benchmarking')
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(1).click();
    // Create i2p cookbook steps
    await page.getByRole('button', {name: 'View Cookbooks'}).click();
    await page.goto('http://localhost:3000/benchmarking/cookbooks');
    await page.getByRole('button', {name: 'Create New Cookbook'}).click();
    await page.getByPlaceholder('Give this cookbook a unique').click();
    await page.getByPlaceholder('Give this cookbook a unique').fill(COOKBOOK_NAME);
    await page.getByRole('button', {name: 'Select Recipes'}).click();
    await page.getByPlaceholder('Search by name').click();
    await page.getByPlaceholder('Search by name').fill('jailbreak pro');
    await page.getByLabel('Select Jailbreak Prompts').check();
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Create Cookbook'}).click();
    await page.getByRole('button', {name: 'View Cookbooks'}).click();

    await page.locator('li').filter({hasText: 'benchmarking'}).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();

    //Edit i2p endpoint
    const REFUSAL_EVALUATOR_ENDPOINT_NAME: string = "Refusal Evaluator";
    await page.locator('li').filter({hasText: REFUSAL_EVALUATOR_ENDPOINT_NAME + "Added"}).getByRole('button').click();
    await page.getByPlaceholder('Access token for the remote').fill("" + process.env.OPENAI_TOKEN + "");
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    //Edit Target Endpoint
    const AZURE_OPENAI_ENDPOINT_NAME: string = "Azure OpenAI GPT4o";
    await page.locator('li').filter({hasText: AZURE_OPENAI_ENDPOINT_NAME + "Added"}).getByRole('button').click();
    // await page.getByPlaceholder('URI of the remote model').fill(process.env.URI);
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill('' + process.env.URI + '');
    await page.getByPlaceholder('Access token for the remote').fill(process.env.TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    ///////////////////////////////////////////////////////////////////
    await page.getByLabel('Select ' + AZURE_OPENAI_ENDPOINT_NAME, {exact: true}).check();
    await page.getByLabel('Next View').click();

    await page.getByRole('button', {name: 'Trust & Safety'}).click();
    await page.getByLabel('Select ' + COOKBOOK_NAME).check();
    await page.getByLabel('Next View').click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1800000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:36')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

test('test_benchmarking_one_endpoint_cookbook_h2ogpte', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(2100000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    await page.goto('http://localhost:3000');
    const ENDPOINT_NAME: string = "Amazon Bedrock - Anthropic Claude 3 Sonnet";
    const RUNNER_NAME: string = "Test h2opte " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await page.getByRole('listitem').nth(1).click();
    //Edit Dependency Endpoint
    await page.getByRole('button', {name: 'Start New Run'}).click();

    //Edit Dependency Endpoints
    await page.getByRole('button', {name: 'Edit h2ogpte-danube3'}).click();
    await page.getByRole('textbox', {name: 'Model'}).click();
    // Replace endpoint default model 'h2oai/h2o-danube3-4b-chat' with Mixtral as it is no longer available
    await page.getByRole('textbox', {name: 'Model'}).fill('mistralai/Mixtral-8x7B-Instruct-v0.1');  
    await page.getByRole('textbox', {name: 'URI'}).fill('https://h2ogpte.genai.h2o.ai');
    await page.getByRole('textbox', {name: 'Token*'}).click();
    await page.getByRole('textbox', {name: 'Token*'}).fill(process.env.H2OGPT_TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByRole('checkbox', { name: 'Select h2ogpte-danube3' }).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();

    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1800000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:7')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forh2ogpte-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});

// This test case is ran manually whenever we release but keeping it as test.skip to disable due to limited tokens
test.skip('test_benchmarking_one_endpoint_cookbook_huggingface', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(2100000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    await page.goto('http://localhost:3000');
    const RUNNER_NAME: string = "Test huggingface " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await page.getByRole('listitem').nth(1).click();
    //Edit Dependency Endpoint
    await page.getByRole('button', {name: 'Start New Run'}).click();

    //Edit Dependency Endpoints
    await page.getByRole('button', { name: 'Edit HuggingFace Deepseek R1' }).click();
    await page.getByRole('textbox', {name: 'Token*'}).click();
    await page.getByRole('textbox', {name: 'Token*'}).fill(process.env.HUGGINGFACE_TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByRole('checkbox', { name: 'Select HuggingFace Deepseek R1' }).check();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();

    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1800000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:1')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results forhuggingface-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()

});
// This test case is ran manually whenever we release but keeping it as test.skip to disable due to limited tokens
test.skip('test_benchmarking_one_endpoint_cookbook_anthropic', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(2100000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    await page.goto('http://localhost:3000');
    const RUNNER_NAME: string = "Test anthropic " + Math.floor(Math.random() * 1000000000);
    // Benchmarking
    console.log('Benchmarking')
    await page.getByRole('listitem').nth(1).click();
    //Edit Dependency Endpoint
    await page.getByRole('button', {name: 'Start New Run'}).click();

    //Edit Dependency Endpoints
    await page.getByRole('button', {name: 'Edit Anthropic-Claude2'}).click();
    await page.getByRole('textbox', {name: 'Token*'}).click();
    await page.getByRole('textbox', {name: 'Token*'}).fill(process.env.ANTHROPIC_TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////
    await page.getByRole('checkbox', { name: 'Select Anthropic-Claude2' }).check()
    await page.getByLabel('Next View').click();
    await page.getByRole('button', { name: 'Capability' }).click();
    
    await page.getByLabel('Select singapore-context').check();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    ////////////////////////////////////////////////////////////////////////////
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 1800000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:1')).toBeVisible();
    await page.getByRole('main').getByRole('img').nth(1).click();
    // await download_validation_steps (page)
    await page.getByRole('button', {name: 'View Report'}).click();
    await page.locator('main').filter({hasText: 'Showing results foranthropic-'}).getByRole('link').first().click();
    await page.getByText(/back to home/i).click()
});
