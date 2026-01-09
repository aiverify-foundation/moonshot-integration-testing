import {Page, test} from '@playwright/test';
import {expect} from "@playwright/test";
// import {create_endpoint_steps} from './endpoint.spec';
import dotenv from 'dotenv';
import path from 'path';
import fs from "fs/promises";

import {
    configure_chatgpt4o, 
    configure_llamaguard, 
    create_and_select_azureGPT4o_endpoint, 
    fill_runner_name, 
    generateRandomName, 
    checkCookbookInReport} from './benchmarking.spec';

// Read from ".env" file.
const __dirname: string = '.'
dotenv.config({path: path.resolve(__dirname, '.env')});


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
test('test_benchmarking_one_endpoint_cookbook_adversarial-prompts', { tag: ['@wip', '@passed'] }, async ({browserName, page}) => {
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
test('test_benchmarking_one_endpoint_cookbook_data-disclosure', { tag: ['@wip', '@passed'] }, async ({browserName, page}) => {
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
test('test_benchmarking_one_endpoint_cookbook_hallucination', { tag: ['@wip', '@passed'] }, async ({browserName, page}) => {
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
