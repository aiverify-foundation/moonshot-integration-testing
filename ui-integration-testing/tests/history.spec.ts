import {Page, test} from '@playwright/test';
import {expect} from "@playwright/test";
// import {create_endpoint_steps} from './endpoint.spec';
import dotenv from 'dotenv';
import path from 'path';
import fs from "fs/promises";
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


test('test_history_tab_view_past_runs_btn_start_new_run_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(3).click();
    await page.getByRole('button', {name: 'View Past Runs'}).click();
    await page.getByRole('button', {name: 'Start New Run'}).click();
    await expect(page.locator('h2')).toContainText('Select the Endpoint(s) to be tested');

});

test('test_history_tab_view_past_runs_btn_view_past_run_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    //Run a benchmarking record
    const ENDPOINT_NAME_RAND: number = Math.floor(Math.random() * 1000000000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + ENDPOINT_NAME_RAND;
    const RUNNER_NAME: string = "Test " + ENDPOINT_NAME_RAND;
    await create_single_endpoint_benchmark_steps(page, ENDPOINT_NAME, RUNNER_NAME)
    await expect(page.getByRole('button', {name: 'View Report'})).toBeVisible({timeout: 600000})
    //Check Details
    await page.getByRole('button', {name: 'See Details'}).click();
    await expect(page.getByText("Name:" + RUNNER_NAME)).toBeVisible();
    await expect(page.getByText('Description:')).toBeVisible();
    await expect(page.getByText('Number of prompts to run:1')).toBeVisible();
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

    //Verify if benchmark record renders after clicking history tab to view past runs results
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(3).click();
    await page.getByRole('button', {name: 'View Past Runs'}).click();
    await page.getByRole('heading', { name: 'Test ' + ENDPOINT_NAME_RAND }).first().scrollIntoViewIfNeeded();
    await page.getByRole('heading', {name: 'Test ' + ENDPOINT_NAME_RAND}).first().click();
    await page.getByRole('button', {name: 'View Results'}).click();
    await page.locator('main').filter({hasText: 'Showing results forazure-'}).getByRole('link').first().click();
});

test('test_history_tab_view_past_session_btn_start_new_session_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(3).click();
    await page.getByRole('button', {name: 'View Past Sessions'}).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await expect(page.locator('h2')).toContainText('Select the Endpoint(s) to be tested');

});
test('test_history_tab_view_past_session_btn_view_past_session_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    const RND_NO: string = String(Math.floor(Math.random() * 1000000000));
    const ENDPOINT_NAME: string = "Azure OpenAI " + RND_NO;
    const RUNNER_NAME: string = "Test " + RND_NO;
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Start Red Teaming and Create New Session
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await page.getByRole('banner').filter({hasText: /^$/}).getByRole('img').click();
    await page.getByRole('button', {name: 'Exit'}).click();

    //Click on History tab and to resume session btn
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(3).click();
    await page.getByRole('button', {name: 'View Past Sessions'}).click();
    await expect(page.locator('h1')).toContainText('Past Red Teaming Sessions');
    await page.getByRole('button', {name: 'Resume Session'}).click();

    // Start Red teaming Session
    await page.getByRole('button', {name: 'Prompt Template'}).click();
    await page.locator('div').filter({hasText: /^mmlu$/}).click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByRole('button', {name: 'Context Strategy'}).click();
    await page.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.getByRole('status').locator('div').nth(1)).toBeVisible();

    // Create the locator for the element
    const elementLocator = page.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    const isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();
    await expect(page.locator('div > li').nth(0)).toBeVisible();
    // Locate the <h1> element with class "text-right" and text "Automated red teaming agent"
    const h1Element = page.locator('h1.text-right').nth(0);

    // Assert that the <h1> element with class "text-right" contains the text "Automated red teaming agent"
    await expect(h1Element).toBeVisible({timeout: 1200000});
    await expect(h1Element).toHaveText('Automated red teaming agent');
    // Locate the <h1> element with class "text-left" and text "Response"
    const h2Element = page.locator('h1.text-left').nth(0);

    await expect(h2Element).toBeVisible({timeout: 1200000})
    await expect(h2Element).toHaveText('Response');
});
