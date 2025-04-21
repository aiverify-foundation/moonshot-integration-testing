import {Page, test} from '@playwright/test';
import {expect} from "@playwright/test";
// import {create_endpoint_steps} from './endpoint.spec';
import dotenv from 'dotenv';
import path from 'path';
import fs from "fs/promises";
// Read from ".env" file.
const __dirname: string = '.'
dotenv.config({path: path.resolve(__dirname, '.env')});
test('test_util_tab_view_prompt_template_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(4).click();
    await page.getByRole('button', {name: 'View Prompt Templates'}).click();
    await expect(page.locator('h1')).toContainText('Prompt Templates');

});

test('test_util_tab_view_context_strategies_btn', async ({browserName, page}) => {
    test.setTimeout(1200000);
    await page.goto('http://localhost:3000');
    await page.getByRole('listitem').nth(4).click();
    await page.getByRole('button', {name: 'View Context Strategies'}).click();
    await expect(page.locator('h1')).toContainText('Context Strategies');

});