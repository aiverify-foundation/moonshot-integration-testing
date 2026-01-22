import {test} from '@playwright/test';
import {expect} from "@playwright/test";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import {execSync} from 'child_process';

import path from 'path';

const __dirname: string = '.'
dotenv.config({path: path.resolve(__dirname, '.env')});

/**
 * Kills all processes using the specified SQLite database file.
 * @param dbFile - The path to the SQLite DB file (e.g., 'mydb.db')
 */
function killSQLiteConnections(dbFile: string): void {
    try {
        const safeFile = path.resolve(dbFile); // prevent relative path issues
        const output = execSync(`lsof ${safeFile}`).toString();

        const pids = [...new Set(
            output
                .split('\n')
                .filter(line => line.includes(safeFile))
                .map(line => line.trim().split(/\s+/)[1])
        )];

        for (const pid of pids) {
            if (pid && !isNaN(Number(pid))) {
                try {
                    execSync(`kill ${pid}`);
                    console.log(`Killed process using ${safeFile} with PID ${pid}`);
                } catch (err) {
                    console.error(`Failed to kill PID ${pid}:`, err);
                }
            }
        }
    } catch (error) {
        console.error(`No active SQLite connections found for ${dbFile} (or lsof missing).`);
    }
}

export async function create_endpoint_steps(page, name, uri, token, connectorType, maxCallPerSec, maxConcurr, model, otherParams, uriSkipCheck?: boolean) {
    await page.goto('http://localhost:3000/endpoints/new');
    await page.getByPlaceholder('Name of the model').click();
    await page.getByPlaceholder('Name of the model').fill(name);
    await page.locator('.aiv__input-container').click();
    await page.getByRole('option', {name: connectorType, exact: true}).click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill(uri);
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill(token);
    await page.getByPlaceholder('Model of the model endpoint').click();
    await page.getByPlaceholder('Model of the model endpoint').fill(model);
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

test('test_red_teaming', async ({browserName, page}) => {
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await page.getByRole('button', {name: 'Prompt Template'}).click();
    await page.locator('div').filter({hasText: /^mmlu$/}).click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByRole('button', {name: 'Context Strategy'}).click();
    await page.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.locator('div > li').nth(2)).toBeVisible({timeout: 600000});
    await expect(page.locator('div > li').nth(4)).toBeVisible({timeout: 600000});
    await expect(page.locator('div > li').nth(7)).toBeVisible({timeout: 600000});
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
test('test_red_teaming_invalid_endpoint', async ({browserName, page}) => {
    test.setTimeout(1200000); //set test timeout to 1 hour
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // Check if the browser is FireFox
    test.skip(browserName === 'firefox', 'This test is skipped on WebKit');

    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, 'uri', process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', {name: 'Skip for now'}).click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.context().clearCookies() // Clears all cookies from the context
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.getByRole('heading', {name: 'Error'})).toBeVisible({timeout: 1200000});
    await expect(page.getByRole('main')).toContainText('[ServiceException] UnexpectedError in send_prompt - An unexpected error occurred: Connection error.\n');
    await page.getByRole('button', {name: 'Ok', exact: true}).click();
});

test('test_red_teaming_invalid_endpoint_auto', async ({browserName, page}) => {
    test.setTimeout(1200000); //set test timeout to 1 hour
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // Check if the browser is FireFox
    test.skip(browserName === 'firefox', 'This test is skipped on WebKit');

    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, 'uri', process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await page.getByRole('button', {name: 'Prompt Template'}).click();
    await page.locator('div').filter({hasText: /^mmlu$/}).click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByRole('button', {name: 'Context Strategy'}).click();
    await page.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.context().clearCookies() // Clears all cookies from the context
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.getByRole('status').locator('div').nth(1)).toBeVisible();
    await expect(page.locator('.bg-moongray-600 > .absolute > .waitspinner').first()).toBeVisible();
    await page.waitForTimeout(100000)
    await expect(page.getByRole('status').locator('div').nth(1)).toBeHidden();
    await expect(page.locator('.bg-moongray-600 > .absolute > .waitspinner').first()).toBeHidden();

});

test('test_red_teaming_spinner_check', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
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

    await expect(page.locator('div > li').nth(2)).toBeVisible();
    await expect(page.locator('div > li').nth(4)).toBeVisible();
    await expect(page.locator('div > li').nth(7)).toBeVisible();
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

test('test_red_teaming_with_attack_module_manual_mode', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', {name: 'Skip for now'}).click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

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
    await expect(h1Element).toHaveText('You');
    // Locate the <h1> element with class "text-left" and text "Response"
    const h2Element = page.locator('h1.text-left').nth(0);

    await expect(h2Element).toBeVisible({timeout: 1200000})
    await expect(h2Element).toHaveText('Response');

});

test('test_red_teaming_with_attack_module_runner_name_exist', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', {name: 'Skip for now'}).click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    // Click x button to exit from redteaming session
    await page.locator('div').filter({hasText: new RegExp(`^${RUNNER_NAME}$`)}).getByRole('img').click();
    await page.getByRole('button', {name: 'Exit'}).click();

    // Try Red Teaming with same Runner name
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('button', {name: 'Skip for now'}).click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    await expect(page.getByRole('heading', {name: 'Error'})).toBeVisible({timeout: 1200000});
    await expect(page.locator('body')).toContainText('[ServiceException] UnexpectedError in create_new_session - An unexpected error occurred: [ServiceException] UnexpectedError in create_runner - An unexpected error occurred: [Runner] Unable to create runner because the runner file exists.');

});
test('test_red_teaming_run_two_endpoint', { tag: ['@wip','@passedlocal','@failedpipeline']}, async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const RND_4_ENDPOINT_1 = Math.floor(Math.random() * 1000000000)
    const ENDPOINT_NAME_1: string = "Azure OpenAI " + RND_4_ENDPOINT_1;
    const RED_TEAMING_ENDPOINT_NAME_1: string = "azure-openai-" + RND_4_ENDPOINT_1;
    const RND_4_ENDPOINT_2 = Math.floor(Math.random() * 1000000000)
    const ENDPOINT_NAME_2: string = "Azure OpenAI " + RND_4_ENDPOINT_2;
    const RED_TEAMING_ENDPOINT_NAME_2: string = "azure-openai-" + RND_4_ENDPOINT_2;
    const RND_4_RUNNER = Math.floor(Math.random() * 1000000000)
    const RUNNER_NAME: string = "Test " + RND_4_RUNNER;
    await create_endpoint_steps(page, ENDPOINT_NAME_1, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await create_endpoint_steps(page, ENDPOINT_NAME_2, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME_1!).click();
    await page.getByText(ENDPOINT_NAME_2!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
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

    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_1 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(2)).toBeVisible();
    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_1 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(4)).toBeVisible();
    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_1 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(7)).toBeVisible();

    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_2 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(2)).toBeVisible();
    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_2 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(4)).toBeVisible();
    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_2 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(7)).toBeVisible();

});

// Need to do npm install sqlite3 to allow using sqlite3 for bookmark enabling threading for playwright to run
// let db: sqlite3.Database;
// test.beforeEach(async () => {
//     // Initialize a new SQLite connection for each test
//     db = new sqlite3.Database('/Users/jacksonboey/PycharmProjects/moonshot/moonshot-data/generated-outputs/bookmarks/bookmark.db');
// });
//
// test.afterEach(async () => {
//     // Close the SQLite connection after each test
//     db.close();
// });
test('test_red_teaming_with_attack_module_charswap_attack', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    await page.setViewportSize({width: 1440, height: 900});
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.locator('li').filter({hasText: 'Character Swap AttackThis'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something\n');
    await page.getByRole('button', {name: 'Send'}).click();

    // Create the locator for the element
    const elementLocator = page.locator('.waitspinner').first();

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    const isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();

    await expect(page.locator('div > li').nth(2)).toBeVisible();
    await expect(page.locator('div > li').nth(4)).toBeVisible();
    await expect(page.locator('div > li').nth(7)).toBeVisible();
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

test('test_red_teaming_with_attack_module_colloquial_wordswap_attack', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Colloquial Wordswap'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.getByRole('status').locator('div').nth(1)).toBeVisible({timeout: 600000});

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

test('test_red_teaming_with_attack_module_homoglyph_attack', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Homoglyph Attack'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something super long test for testing');
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.getByRole('status').locator('div').nth(1)).toBeVisible({timeout: 600000});

    // Create the locator for the element
    const elementLocator = page.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    const isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();

    await expect(page.locator('div > li').nth(1)).toBeVisible();
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

test('test_red_teaming_with_attack_module_insert_punctuation_attack', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Insert Punctuation Attack'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.getByRole('status').locator('div').nth(1)).toBeVisible({timeout: 600000});

    // Create the locator for the element
    const elementLocator = page.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    const isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();

    await expect(page.locator('div > li').nth(2)).toBeVisible();
    await expect(page.locator('div > li').nth(4)).toBeVisible();
    await expect(page.locator('div > li').nth(7)).toBeVisible();
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

test('test_red_teaming_with_attack_module_job_role_generator', { tag: ['@wip','@passedlocal','@failedpipeline']}, async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Job Role Generator Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

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

    await expect(page.locator('div > li').nth(2)).toBeVisible();
    await expect(page.locator('div > li').nth(4)).toBeVisible();
    await expect(page.locator('div > li').nth(7)).toBeVisible();
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

test('test_red_teaming_with_attack_module_malicious_question_generator', async ({browserName, page}) => {
    test.setTimeout(1200000); //set test timeout to 1 hour
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    //Edit Dependency Endpoint
    const OPENAI_ENDPOINT_NAME: string = "OpenAI GPT4";
    await page.getByLabel('Edit ' + OPENAI_ENDPOINT_NAME).click();
    await page.getByPlaceholder('Model of the model endpoint').fill("gpt-4.1");
    await page.getByPlaceholder('Access token for the remote').fill(process.env.OPENAI_TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////

    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Malicious Question Generator'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

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

    await expect(page.locator('div > li').nth(0)).toBeVisible({timeout: 1200000});
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
test('test_red_teaming_with_attack_module_sample_attack_module', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
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

test('test_red_teaming_with_attack_module_sg_sentence_generator', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Singapore Sentence Generator'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.getByRole('status').locator('div').nth(1)).toBeVisible({timeout: 600000});

    // Create the locator for the element
    const elementLocator = page.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    const isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();

    await expect(page.locator('div > li').nth(2)).toBeVisible();
    await expect(page.locator('div > li').nth(4)).toBeVisible();
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

test('test_red_teaming_with_attack_module_textbugger_attack', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'TextBugger Attack'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

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

    await expect(page.locator('div > li').nth(1)).toBeVisible();
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

test('test_red_teaming_with_attack_module_textfooler_attack', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'TextFooler Attack'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();
    await expect(page.getByRole('status').locator('div').nth(1)).toBeVisible({timeout: 600000});

    // Create the locator for the element
    const elementLocator = page.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    const isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();

    await expect(page.locator('div > li').nth(2)).toBeVisible();
    // await expect(page.locator('div > li').nth(4)).toBeVisible();
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

test('test_red_teaming_with_attack_module_toxic_sentence_generator', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

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

    await expect(page.locator('div > li').nth(2)).toBeVisible();
    await expect(page.locator('div > li').nth(4)).toBeVisible();
    await expect(page.locator('div > li').nth(7)).toBeVisible();
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
test('test_red_teaming_with_attack_module_violent_durian', async ({browserName, page}) => {
    test.setTimeout(1200000); //set test timeout to 1 hour
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    //Edit Dependency Endpoint
    const OPENAI_ENDPOINT_NAME: string = "OpenAI GPT4";
    await page.getByLabel('Edit ' + OPENAI_ENDPOINT_NAME).click();
    await page.getByPlaceholder('Access token for the remote').fill(process.env.OPENAI_TOKEN);
    await page.getByRole('button', {name: 'Save'}).click();
    //////////////////////////////////////////////////

    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Violent Durian'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

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

test.skip('test_red_teaming_with_amazon_bedrock', { 
    tag: ['@wip']
}, async ({browserName, page}) => {
    const apiKey = process.env.AWS_ACCESS_KEY_ID;

    const filePath = '/Users/jacksonboey/PycharmProjects/moonshot/moonshot-data/connectors-endpoints/openai-gpt4.json';
    // Use the environment variables
    console.log('AWS_ACCESS_KEY_ID:', apiKey);

    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
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
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    //Edit Dependency Endpoint
    // await page.locator('section').filter({hasText: /^OpenAI GPT4Added/}).locator('button').click();
    // console.log('OPENAI_TOKEN:', process.env.OPENAI_TOKEN);
    // await page.getByPlaceholder('Access token for the remote').click();
    // await page.getByPlaceholder('Access token for the remote').fill(process.env.OPENAI_TOKEN);
    // await page.getByRole('button', {name: 'Save'}).click();
    ////////////////////////////////////////////////
    try {
        // Step 1: Read the JSON file
        const data = await fs.readFile(filePath, 'utf-8');

        // Step 2: Parse the JSON content into an object
        const json = JSON.parse(data);

        // Step 3: Modify nested properties
        // Update the description inside the nested 'details' object
        json.token = process.env.OPENAI_TOKEN;

        // // Add a new field to the nested 'metadata' object
        // json.details.metadata.lastUpdatedAt = new Date().toISOString();
        //
        // // Modify the method of the first endpoint in the 'endpoints' array
        // if (json.endpoints && json.endpoints.length > 0) {
        //     json.endpoints[0].method = "PUT";
        // }

        // Step 4: Write the modified JSON back to the file
        await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');

        console.log('JSON file has been modified successfully');
    } catch (error) {

        console.error('Error reading or writing the JSON file:', error);
    }


////////////////////////////////////////////////
//Edit Dependency Endpoints
    await page.locator('section').filter({hasText: /^Amazon Bedrock - Anthropic Claude 3 SonnetAdded/}).locator('button').click();
    let otherParams = '{\n' +
        '    "timeout": 300,\n' +
        '    "max_attempts": 3,\n' +
        '    "temperature": 0.5,\n' +
        '    "model": "anthropic.claude-3-sonnet-20240229-v1:0",\n' +
        '    "session": {\n' +
        '        "region_name": "us-east-1"\n' +
        '    }\n' +
        '}'
    await page.getByText('More Configs').click();
    await page.getByPlaceholder('Additional parameters').click();
    await page.getByPlaceholder('Additional parameters').fill(otherParams);
    await page.getByRole('button', {name: 'OK'}).click();
    await page.getByRole('button', {name: 'Save'}).click();
    await page.getByLabel('Select Amazon Bedrock - Anthropic Claude 3 Sonnet').check();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Violent Durian'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();

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

test('test_red_teaming_with_attack_module_description_not_empty', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('textbox', {name: 'Description (optional)'}).click();
    await page.getByRole('textbox', {name: 'Description (optional)'}).fill('test');
    await page.getByRole('button', {name: 'Run'}).click();
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
    await expect(page.locator('hgroup')).toContainText('test');

});

test('test_red_teaming_with_attack_module_runner_name_empty', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    // const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    // await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    // await page.getByRole('button', {name: 'Run'}).click();
    const runButton = await page.getByRole('button', {name: 'Run'});
    const isDisabledAttr = await runButton.getAttribute('disabled');
    expect(isDisabledAttr).not.toBeNull();
});

test('test_red_teaming_with_attack_module_runner_name_integer', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "1";
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    const runButton = await page.getByRole('button', {name: 'Run'});
    const isDisabledAttr = await runButton.getAttribute('disabled');
    expect(isDisabledAttr).toBeNull();
});

test('test_red_teaming_with_attack_module_runner_name_decimal', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "1.1";
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    const runButton = await page.getByRole('button', {name: 'Run'});
    const isDisabledAttr = await runButton.getAttribute('disabled');
    expect(isDisabledAttr).toBeNull();
});

test('test_red_teaming_with_attack_module_runner_name_special_char', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "@1";
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    const runButton = await page.getByRole('button', {name: 'Run'});
    const isDisabledAttr = await runButton.getAttribute('disabled');
    expect(isDisabledAttr).toBeNull();
});

test('test_red_teaming_run_two_endpoint_all_invalid', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const RND_4_ENDPOINT_1 = Math.floor(Math.random() * 1000000000)
    const ENDPOINT_NAME_1: string = "Azure OpenAI " + RND_4_ENDPOINT_1;
    const RED_TEAMING_ENDPOINT_NAME_1: string = "azure-openai-" + RND_4_ENDPOINT_1;
    const RND_4_ENDPOINT_2 = Math.floor(Math.random() * 1000000000)
    const ENDPOINT_NAME_2: string = "Azure OpenAI " + RND_4_ENDPOINT_2;
    const RED_TEAMING_ENDPOINT_NAME_2: string = "azure-openai-" + RND_4_ENDPOINT_2;
    const RND_4_RUNNER = Math.floor(Math.random() * 1000000000)
    const RUNNER_NAME: string = "Test " + RND_4_RUNNER;
    await create_endpoint_steps(page, ENDPOINT_NAME_1, process.env.URI, process.env.TOKEN + "1", 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await create_endpoint_steps(page, ENDPOINT_NAME_2, process.env.URI, process.env.TOKEN + "2", 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME_1!).click();
    await page.getByText(ENDPOINT_NAME_2!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
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

    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_1 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(2)).not.toBeVisible();

    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_2 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(2)).not.toBeVisible();

});

test('test_red_teaming_run_two_endpoint_all_mixed', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
    const RND_4_ENDPOINT_1 = Math.floor(Math.random() * 1000000000)
    const ENDPOINT_NAME_1: string = "Azure OpenAI " + RND_4_ENDPOINT_1;
    const RED_TEAMING_ENDPOINT_NAME_1: string = "azure-openai-" + RND_4_ENDPOINT_1;
    const RND_4_ENDPOINT_2 = Math.floor(Math.random() * 1000000000)
    const ENDPOINT_NAME_2: string = "Azure OpenAI " + RND_4_ENDPOINT_2;
    const RED_TEAMING_ENDPOINT_NAME_2: string = "azure-openai-" + RND_4_ENDPOINT_2;
    const RND_4_RUNNER = Math.floor(Math.random() * 1000000000)
    const RUNNER_NAME: string = "Test " + RND_4_RUNNER;
    await create_endpoint_steps(page, ENDPOINT_NAME_1, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    await create_endpoint_steps(page, ENDPOINT_NAME_2, process.env.URI, process.env.TOKEN + "2", 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME_1!).click();
    await page.getByText(ENDPOINT_NAME_2!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
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

    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_1 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(2)).not.toBeVisible();

    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME_2 + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(2)).not.toBeVisible();

});

test('test_red_teaming_with_attack_module_no_endpoint_selected', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    await page.goto('http://localhost:3000/redteaming');
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await expect(page.locator('[aria-label="Next View"]')).toHaveClass(/.*opacity-30.*/);

});

test('test_red_teaming_start_new_session_test_a_new_endpoint_btn', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    await page.goto('http://localhost:3000/redteaming');
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByRole('listitem').filter({hasText: 'Testing a new Endpoint?Create'}).click();
    // Fill in details for endpoints
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    await page.getByPlaceholder('Name of the model').click();
    await page.getByPlaceholder('Name of the model').fill(ENDPOINT_NAME);
    await page.locator('.aiv__input-container').click();
    await page.getByRole('option', {name: 'azure-openai-connector', exact: true}).click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill(process.env.URI);
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill(process.env.TOKEN);
    await page.getByPlaceholder('Model of the model endpoint').click();
    await page.getByPlaceholder('Model of the model endpoint').fill('gpt-4o');
    await page.getByRole('button', {name: 'Save'}).click();

    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
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

test('test_red_teaming_start_new_session_create_new_endpoint_btn', { tag: ['@wip','@passedlocal'] }, async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    await page.goto('http://localhost:3000/redteaming');
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByRole('button', {name: 'Create New Endpoint'}).click();
    // Fill in details for endpoints
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    await page.getByPlaceholder('Name of the model').click();
    await page.getByPlaceholder('Name of the model').fill(ENDPOINT_NAME);
    await page.locator('.aiv__input-container').click();
    await page.getByRole('option', {name: 'azure-openai-connector', exact: true}).click();
    await page.getByPlaceholder('URI of the remote model').click();
    await page.getByPlaceholder('URI of the remote model').fill(process.env.URI);
    await page.getByPlaceholder('Access token for the remote').click();
    await page.getByPlaceholder('Access token for the remote').fill(process.env.TOKEN);
    await page.getByPlaceholder('Model of the model endpoint').click();
    await page.getByPlaceholder('Model of the model endpoint').fill('gpt-4o');
    await page.getByRole('button', {name: 'Save'}).click();

    await page.getByText(ENDPOINT_NAME!, {timeout: 20000}).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
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

    await expect(h2Element).toBeVisible({timeout: 1000000})
    await expect(h2Element).toHaveText('Response');
});

test('test_red_teaming_view_past_new_session_btn_start_new_session_btn', async ({browserName, page}) => {
    // test.setTimeout(3600000); //set test timeout to 1 hour
    test.setTimeout(1200000); //set test timeout to 1 hour
    const ENDPOINT_NAME: string = "Azure OpenAI " + Math.floor(Math.random() * 1000000000);
    const RUNNER_NAME: string = "Test " + Math.floor(Math.random() * 1000000000);
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.goto('http://localhost:3000/redteaming');
    await page.getByRole('button', {name: 'View Past Sessions'}).click();
    await expect(page.locator('h1')).toContainText('Past Red Teaming Sessions');
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Sample Attack Module'}).click();
    await page.getByLabel('Next View').click();
    await page.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
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

test('test_red_teaming_view_past_new_session_btn_start_resume_session_btn', async ({browserName, page}) => {
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // // Check if the browser is WebKit
    // test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // // Check if the browser is FireFox
    // test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    if (browserName == 'webkit')
        await page.waitForTimeout(60000)
    else if (browserName == 'firefox')
        await page.waitForTimeout(30000)
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

    //Click on Red Teaming tab and to resume session btn
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'View Past Sessions'}).click();
    await page.getByRole('listitem').filter({hasText: 'test-' + RND_NO}).click();
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

test('test_red_teaming_view_attack_modules_btn', async ({browserName, page}) => {
    test.setTimeout(1200000); //set test timeout to 1 hour
    await page.goto('http://localhost:3000');
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'View Attack Modules'}).click();
    await expect(page.locator('h1')).toContainText('Attack Modules');

});

test('test_red_teaming_add_bookmark', { tag: ['@wip','@passedlocal','@failedpipeline'] }, async ({browserName, page}) => {
    console.log(path.resolve(__dirname, '.env'))
    // const dbFile = process.env.CLI_DIR + '/moonshot-data/generated-outputs/bookmarks/bookmark.db';
    // console.log(`Attempting to kill connections for ${dbFile}`);
    // killSQLiteConnections(dbFile)

    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // Check if the browser is FireFox
    test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    const RND_4_ENDPOINT = Math.floor(Math.random() * 1000000000)
    const RED_TEAMING_ENDPOINT_NAME: string = "azure-openai-" + RND_4_ENDPOINT;
    // if (browserName == 'webkit')
    //     await page.waitForTimeout(60000)
    // else if (browserName == 'firefox')
    //     await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + RND_4_ENDPOINT;
    const RND_4_RUNNER = Math.floor(Math.random() * 1000000000)
    const RUNNER_NAME: string = "Test " + RND_4_RUNNER;
    await create_endpoint_steps(page, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await page.getByRole('listitem').nth(2).click();
    await page.getByRole('button', {name: 'Start New Session'}).click();
    await page.getByText(ENDPOINT_NAME!).click();
    await page.getByLabel('Next View').click();
    await page.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();

    await page.getByLabel('Next View').click();
    await page.getByRole('textbox', {name: 'Name'}).fill(RUNNER_NAME);
    await page.getByRole('button', {name: 'Run'}).click();
    await page.getByRole('button', {name: 'Prompt Template'}).click();
    await page.locator('div').filter({hasText: /^mmlu$/}).click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByRole('button', {name: 'Context Strategy'}).click();
    await page.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
    await page.getByRole('button', {name: 'Use'}).click();
    await page.getByPlaceholder('Write a prompt...').click();
    await page.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await page.getByRole('button', {name: /send/i}).click();

    // Create the locator for the element
    let elementLocator = page.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden', timeout: 240000});


    // Assert that the element is no longer visible
    let isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();

    await expect(page.locator('div > li').nth(0)).toBeVisible();
    await expect(page.locator('div > li').nth(2)).toBeVisible();
    await expect(page.locator('div > li').nth(4)).toBeVisible();
    await expect(page.locator('div > li').nth(7)).toBeVisible();
    // Locate the <h1> element with class "text-right" and text "You"
    let h1Element = page.locator('h1.text-right').nth(0);

    // Assert that the <h1> element with class "text-right" contains the text "You"
    await expect(h1Element).toBeVisible();
    await expect(h1Element).toHaveText('Automated red teaming agent');
    // Locate the <h1> element with class "text-right" and text "You"
    let h2Element = page.locator('h1.text-left').nth(0);

    await expect(h2Element).toBeVisible()
    await expect(h2Element).toHaveText('Response');

    await expect(page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(7)).toBeVisible();
    await page.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME + ' > div > div.custom-scrollbar > div#chatContainer > li:nth-of-type(2) > div:nth-of-type(1) > div > div > div:nth-of-type(1) > div > div[role="button"]').click();
    await page.getByPlaceholder('Give this bookmark a unique').click();
    await page.getByPlaceholder('Give this bookmark a unique').fill('bookmark_mark' + RND_4_ENDPOINT);
    await page.getByRole('button', {name: 'Save'}).click();
    await expect(page.getByRole('main')).toContainText('Bookmark ' + 'bookmark_mark' + RND_4_ENDPOINT + ' was successfully saved.');
});

test('test_red_teaming_view_bookmark', { tag: ['@wip','@passedlocal','@failedpipeline'] }, async ({page, browser}) => {
    // This ensures a clean state for each test by creating a new context
    const context = await browser.newContext();  // Creates an isolated browser context
    const newPage = await context.newPage();    // Create a new page within the isolated context
    test.setTimeout(1200000); //set test timeout to 1 hour
    const RND_4_ENDPOINT = Math.floor(Math.random() * 1000000000)
    const RED_TEAMING_ENDPOINT_NAME: string = "azure-openai-" + RND_4_ENDPOINT;

    const ENDPOINT_NAME: string = "Azure OpenAI " + RND_4_ENDPOINT;
    const RND_4_RUNNER = Math.floor(Math.random() * 1000000000)
    const RUNNER_NAME: string = "Test " + RND_4_RUNNER;
    await create_endpoint_steps(newPage, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await newPage.getByRole('listitem').nth(2).click();
    await newPage.getByRole('button', {name: 'Start New Session'}).click();
    await newPage.getByText(ENDPOINT_NAME!).click();
    await newPage.getByLabel('Next View').click();
    await newPage.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await newPage.getByLabel('Next View').click();
    await newPage.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await newPage.getByRole('button', {name: 'Run'}).click();
    await newPage.getByRole('button', {name: 'Prompt Template'}).click();
    await newPage.locator('div').filter({hasText: /^mmlu$/}).click();
    await newPage.getByRole('button', {name: 'Use'}).click();
    await newPage.getByRole('button', {name: 'Context Strategy'}).click();
    await newPage.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
    await newPage.getByRole('button', {name: 'Use'}).click();
    await newPage.getByPlaceholder('Write a prompt...').click();
    await newPage.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await newPage.getByRole('button', {name: /send/i}).click();

    // Create the locator for the element
    const elementLocator = newPage.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden', timeout: 240000});


    // Assert that the element is no longer visible
    const isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();


    await expect(newPage.locator('div > li').nth(2)).toBeVisible();
    await expect(newPage.locator('div > li').nth(4)).toBeVisible();
    await expect(newPage.locator('div > li').nth(7)).toBeVisible();
    // Locate the <h1> element with class "text-right" and text "You"
    const h1Element = newPage.locator('h1.text-right').nth(0);

    // Assert that the <h1> element with class "text-right" contains the text "You"
    await expect(h1Element).toBeVisible();
    await expect(h1Element).toHaveText('Automated red teaming agent');
    // Locate the <h1> element with class "text-right" and text "You"
    const h2Element = newPage.locator('h1.text-left').nth(0);

    await expect(h2Element).toBeVisible()
    await expect(h2Element).toHaveText('Response');

    await expect(newPage.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(7)).toBeVisible();
    await newPage.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME + ' > div > div.custom-scrollbar > div#chatContainer > li:nth-of-type(2) > div:nth-of-type(1) > div > div > div:nth-of-type(1) > div > div[role="button"]').click();
    await newPage.getByPlaceholder('Give this bookmark a unique').click();
    await newPage.getByPlaceholder('Give this bookmark a unique').fill('bookmark_mark' + RND_4_ENDPOINT);
    await newPage.getByRole('button', {name: 'Save'}).click();
    await expect(newPage.getByRole('main')).toContainText('Bookmark ' + 'bookmark_mark' + RND_4_ENDPOINT + ' was successfully saved.');
    await newPage.getByRole('button', {name: 'View Bookmarks'}).click();
    await newPage.locator('li').filter({hasText: 'bookmark_mark' + RND_4_ENDPOINT}).click();
    await expect(newPage.locator('section').getByRole('heading', {name: 'bookmark_mark' + RND_4_ENDPOINT})).toBeVisible();
    // Navigate to the desired page
    console.log(path.resolve(__dirname, '.env'));
    await newPage.goto('http://localhost:3000/endpoints/new');

    // Perform the actions you want to test
    await newPage.getByRole('listitem').nth(2).click();
    await newPage.getByRole('button', {name: 'View Bookmarks'}).click();

    // Assertions
    await expect(newPage.locator('h1')).toContainText('Bookmarks');
    await expect(newPage.getByRole('button', {name: 'Export Bookmarks'})).toBeVisible();

    // Clean up by closing the context after the test
    await context.close();
});

test('test_red_teaming_export_bookmark', { tag: ['@wip','@passedlocal','@failedpipeline'] }, async ({browserName, page,browser}) => {

    const context = await browser.newContext();  // Creates an isolated browser context
    const newPage = await context.newPage();    // Create a new page within the isolated context

    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // Check if the browser is FireFox
    test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    const RND_4_ENDPOINT = Math.floor(Math.random() * 1000000000)
    const RED_TEAMING_ENDPOINT_NAME: string = "azure-openai-" + RND_4_ENDPOINT;
    // if (browserName == 'webkit')
    //     await page.waitForTimeout(60000)
    // else if (browserName == 'firefox')
    //     await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + RND_4_ENDPOINT;
    const RND_4_RUNNER = Math.floor(Math.random() * 1000000000)
    const RUNNER_NAME: string = "Test " + RND_4_RUNNER;
    await create_endpoint_steps(newPage, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await newPage.getByRole('listitem').nth(2).click();
    await newPage.getByRole('button', {name: 'Start New Session'}).click();
    await newPage.getByText(ENDPOINT_NAME!).click();
    await newPage.getByLabel('Next View').click();
    await newPage.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await newPage.getByLabel('Next View').click();
    await newPage.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await newPage.getByRole('button', {name: 'Run'}).click();
    await newPage.getByRole('button', {name: 'Prompt Template'}).click();
    await newPage.locator('div').filter({hasText: /^mmlu$/}).click();
    await newPage.getByRole('button', {name: 'Use'}).click();
    await newPage.getByRole('button', {name: 'Context Strategy'}).click();
    await newPage.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
    await newPage.getByRole('button', {name: 'Use'}).click();
    await newPage.getByPlaceholder('Write a prompt...').click();
    await newPage.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await newPage.getByRole('button', {name: /send/i}).click();

    // Create the locator for the element
    const elementLocator = newPage.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    const isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();


    await expect(newPage.locator('div > li').nth(2)).toBeVisible();
    await expect(newPage.locator('div > li').nth(4)).toBeVisible();
    await expect(newPage.locator('div > li').nth(7)).toBeVisible();
    // Locate the <h1> element with class "text-right" and text "You"
    const h1Element = newPage.locator('h1.text-right').nth(0);

    // Assert that the <h1> element with class "text-right" contains the text "You"
    await expect(h1Element).toBeVisible();
    await expect(h1Element).toHaveText('Automated red teaming agent');
    // Locate the <h1> element with class "text-right" and text "You"
    const h2Element = newPage.locator('h1.text-left').nth(0);

    await expect(h2Element).toBeVisible()
    await expect(h2Element).toHaveText('Response');

    await expect(newPage.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(7)).toBeVisible();
    await newPage.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME + ' > div > div.custom-scrollbar > div#chatContainer > li:nth-of-type(2) > div:nth-of-type(1) > div > div > div:nth-of-type(1) > div > div[role="button"]').click();
    await newPage.getByPlaceholder('Give this bookmark a unique').click();
    await newPage.getByPlaceholder('Give this bookmark a unique').fill('bookmark_mark' + RND_4_ENDPOINT);
    await newPage.getByRole('button', {name: 'Save'}).click();
    await expect(newPage.getByText('Bookmark ' + 'bookmark_mark' + RND_4_ENDPOINT + ' was')).toBeVisible();
    await newPage.getByRole('button', {name: 'View Bookmarks'}).click();
    await expect(newPage.getByRole('list')).toContainText('bookmark_mark' + RND_4_ENDPOINT);
    await newPage.getByRole('button', {name: 'Export Bookmarks'}).click();

    await context.close();
});

test('test_red_teaming_use_bookmark', async ({browserName, page,browser}) => {

    const context = await browser.newContext();  // Creates an isolated browser context
    const newPage = await context.newPage();    // Create a new page within the isolated context
    console.log(path.resolve(__dirname, '.env'))
    test.setTimeout(1200000); //set test timeout to 1 hour
    const FIRE_RED_TEAMING_BTN: number = Math.floor(Math.random() * 1000000000)
    // Check if the browser is WebKit
    test.skip(browserName === 'webkit', 'This test is skipped on WebKit');
    // Check if the browser is FireFox
    test.skip(browserName === 'firefox', 'This test is skipped on WebKit');
    const RND_4_ENDPOINT = Math.floor(Math.random() * 1000000000)
    const RED_TEAMING_ENDPOINT_NAME: string = "azure-openai-" + RND_4_ENDPOINT;
    // if (browserName == 'webkit')
    //     await page.waitForTimeout(60000)
    // else if (browserName == 'firefox')
    //     await page.waitForTimeout(30000)
    const ENDPOINT_NAME: string = "Azure OpenAI " + RND_4_ENDPOINT;
    const RND_4_RUNNER = Math.floor(Math.random() * 1000000000)
    const RUNNER_NAME: string = "Test " + RND_4_RUNNER;
    await create_endpoint_steps(newPage, ENDPOINT_NAME, process.env.URI, process.env.TOKEN, 'azure-openai-connector', '2', '', 'gpt-4o', '{\n "timeout": 300,\n "max_attempts": 3,\n "temperature": 0.5\n}', true)
    // Red Teaming
    console.log('Red Teaming')
    await newPage.getByRole('listitem').nth(2).click();
    await newPage.getByRole('button', {name: 'Start New Session'}).click();
    await newPage.getByText(ENDPOINT_NAME!).click();
    await newPage.getByLabel('Next View').click();
    await newPage.getByRole('heading', {name: 'Toxic Sentence Generator'}).click();
    await newPage.getByLabel('Next View').click();
    await newPage.getByPlaceholder('Give this session a unique').fill(RUNNER_NAME);
    await newPage.getByRole('button', {name: 'Run'}).click();
    await newPage.getByRole('button', {name: 'Prompt Template'}).click();
    await newPage.locator('div').filter({hasText: /^mmlu$/}).click();
    await newPage.getByRole('button', {name: 'Use'}).click();
    await newPage.getByRole('button', {name: 'Context Strategy'}).click();
    await newPage.locator('div').filter({hasText: /^Add Previous Prompt$/}).first().click();
    await newPage.getByRole('button', {name: 'Use'}).click();
    await newPage.getByPlaceholder('Write a prompt...').click();
    await newPage.getByPlaceholder('Write a prompt...').fill('Generate Something');
    await newPage.getByRole('button', {name: /send/i}).click();

    // Create the locator for the element
    let elementLocator = newPage.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({state: 'visible'}); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    let isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();


    await expect(newPage.locator('div > li').nth(2)).toBeVisible();
    await expect(newPage.locator('div > li').nth(4)).toBeVisible();
    await expect(newPage.locator('div > li').nth(7)).toBeVisible();
    // Locate the <h1> element with class "text-right" and text "You"
    let h1Element = newPage.locator('h1.text-right').nth(0);

    // Assert that the <h1> element with class "text-right" contains the text "You"
    await expect(h1Element).toBeVisible();
    await expect(h1Element).toHaveText('Automated red teaming agent');
    // Locate the <h1> element with class "text-right" and text "You"
    let h2Element = newPage.locator('h1.text-left').nth(0);

    await expect(h2Element).toBeVisible()
    await expect(h2Element).toHaveText('Response');

    await expect(newPage.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME + ' > div > div.custom-scrollbar > div#chatContainer > li').nth(7)).toBeVisible();
    await newPage.locator('#win_test-' + RND_4_RUNNER + '-' + RED_TEAMING_ENDPOINT_NAME + ' > div > div.custom-scrollbar > div#chatContainer > li:nth-of-type(2) > div:nth-of-type(1) > div > div > div:nth-of-type(1) > div > div[role="button"]').click();
    await newPage.getByPlaceholder('Give this bookmark a unique').click();
    await newPage.getByPlaceholder('Give this bookmark a unique').fill('bookmark_mark' + RND_4_ENDPOINT);
    await newPage.getByRole('button', {name: 'Save'}).click();
    await expect(newPage.getByText('Bookmark ' + 'bookmark_mark' + RND_4_ENDPOINT + ' was')).toBeVisible();
    await newPage.getByRole('button', {name: 'View Bookmarks'}).click();
    await newPage.locator('li').filter({hasText: 'bookmark_mark' + RND_4_ENDPOINT}).click();
    await expect(newPage.locator('section').getByRole('heading', {name: 'bookmark_mark' + RND_4_ENDPOINT})).toBeVisible();

    //Use bookmark and verify red teaming session will rerun again
    await newPage.getByRole('button', {name: 'Use'}).click();
    // Create the locator for the element
    elementLocator = newPage.getByRole('status').locator('div').nth(1);

    // Wait for the element to appear with a custom timeout
    await elementLocator.waitFor({ state: 'visible', timeout: 240000 }); // 60 seconds

    // Optionally, perform any actions or wait for the element to disappear
    await elementLocator.waitFor({state: 'hidden'}); // 60 seconds


    // Assert that the element is no longer visible
    isVisible = await elementLocator.isVisible();
    expect(isVisible).toBeFalsy();


    await expect(newPage.locator('div > li').nth(2)).toBeVisible();
    await expect(newPage.locator('div > li').nth(4)).toBeVisible();
    await expect(newPage.locator('div > li').nth(7)).toBeVisible();
    // Locate the <h1> element with class "text-right" and text "You"
    h1Element = newPage.locator('h1.text-right').nth(0);

    // Assert that the <h1> element with class "text-right" contains the text "You"
    await expect(h1Element).toBeVisible();
    await expect(h1Element).toHaveText('Automated red teaming agent');
    // Locate the <h1> element with class "text-right" and text "You"
    h2Element = newPage.locator('h1.text-left').nth(0);

    await expect(h2Element).toBeVisible()
    await expect(h2Element).toHaveText('Response');
    await context.close();

});
