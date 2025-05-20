import {test, expect} from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';


test('test_welcome_page', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'How can the Testing Framework'})).toBeVisible();

});

test('test_welcome_page_click_home_btn', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'How can the Testing Framework'})).toBeVisible();

    await page.getByRole('button', {name: 'home icon Home'}).click();
    await page.getByRole('button', {name: 'Yes, start over'}).click();
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

});

test.skip('test_getting_started_page_pdf_download', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page for PDF
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);

    // // Checkpoint - check download link feature on Getting Started Page for PDF
    // // ✅ Handle the PDF link as a download
    // const downloadPromise = page.waitForEvent('download');
    //
    // // Click the link (triggers the download)
    // await page.getByRole('link', {name: 'Download Testing Framework - PDF'}).click();
    //
    // // Wait for the download to complete
    // const download = await downloadPromise;
    //
    // // Confirm the download URL
    // const downloadUrl = download.url();
    // console.log('PDF Download URL:', downloadUrl);
    //
    // // Assert the expected download URL
    // expect(downloadUrl).toBe(
    //     "https://www.cpf.gov.sg/content/dam/web/member/faq/general-information---useful-tips/documents/Guide_to_view_and_save_CPF_statements.pdf"
    // );

    // Checkpoint - check download link feature on Getting Started Page for Excel
    // Try download and popup listeners together
    const [popupOrDownload] = await Promise.all([
        Promise.race([
            page.waitForEvent('popup'),
            page.waitForEvent('download'),
        ]),
        page.getByRole('link', {name: 'Download Testing Framework - PDF'}).click(),
    ]);

    if (popupOrDownload.url) {
        // It's a download
        const download = popupOrDownload;
        console.log('Excel download URL:', download.url());
        expect(download.url()).toBe(
            "https://www.cpf.gov.sg/content/dam/web/member/faq/general-information---useful-tips/documents/Guide_to_view_and_save_CPF_statements.pdf"
        );
    } else {
        // It's a popup
        const popup = popupOrDownload;
        await popup.waitForLoadState('load');
        const popupUrl = popup.url();
        console.log('Excel opened in new tab:', popupUrl);
        expect(popupUrl).toBe(
            "https://www.cpf.gov.sg/content/dam/web/member/faq/general-information---useful-tips/documents/Guide_to_view_and_save_CPF_statements.pdf"
        );
    }

});

test('test_getting_started_page_excel_download', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page for PDF
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);

    // Checkpoint - check download link feature on Getting Started Page for Excel
    // Try download and popup listeners together
    const [popupOrDownload] = await Promise.all([
        Promise.race([
            page.waitForEvent('popup'),
            page.waitForEvent('download'),
        ]),
        page.getByRole('link', {name: 'Download Testing Framework - Excel'}).click(),
    ]);

    if (popupOrDownload.url) {
        // It's a download
        const download = popupOrDownload;
        console.log('Excel download URL:', download.url());
        expect(download.url()).toBe(
            "https://go.gov.sg/aivtf-excel"
        );
    } else {
        // It's a popup
        const popup = popupOrDownload;
        await popup.waitForLoadState('load');
        const popupUrl = popup.url();
        console.log('Excel opened in new tab:', popupUrl);
        expect(popupUrl).toBe(
            "https://go.gov.sg/aivtf-excel"
        );
    }


});

test('test_getting_started_page_click_home_btn', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'home icon Home'}).click();
    await page.getByRole('button', {name: 'Yes, start over'}).click();
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
});

test('test_getting_started_page_click_back_btn', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: '← Back'}).click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'How can the Testing Framework'})).toBeVisible();
});

test('test_complete_process_checks_page', async ({page}) => {
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    const boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();

});
test('test_complete_process_checks_page_create_session_validation', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    // Attempt to fill workspace session details
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByText('Please enter a workspace name')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByText('Please enter a workspace name')).toBeVisible();
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByText('Please enter a workspace name')).toBeVisible();
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByText('Please enter a workspace name')).toBeVisible();
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    const boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();

});

test('test_complete_process_checks_page_duplicate_workspace_name', async ({page}) => {
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    let boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    const boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();

    //Attempt to restart and create session 2
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByTestId('stAlertContentError').getByRole('paragraph')).toContainText('A workspace with this name already exists. Please choose a different name.');

});

test('test_complete_process_checks_page_click_home_btn', async ({page}) => {
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    const boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name)).toBeVisible();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();
    await page.getByRole('button', {name: 'home icon Home'}).click();
    await page.getByRole('button', {name: 'Yes, start over'}).click();
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
});
test('test_complete_process_checks_page_click_back_btn', async ({page}) => {
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    const boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name)).toBeVisible();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();
    //Assert Back function is working
    await page.getByRole('button', {name: '← Back'}).click();
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

});

test('test_complete_process_checks_page_edit_app_information', async ({page}) => {
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    const boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name)).toBeVisible();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByRole('button', {name: 'edit'}).click();

    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name_1');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description_1');
    await page.getByTestId('stBaseButton-primaryFormSubmit').click();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().locator('#app-name')).toContainText('application_name_1');
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().locator('#app-description')).toContainText('application_description_1');


});

test('test_complete_process_checks_page_edit_app_information_leave_blank', async ({page}) => {
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    const boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name)).toBeVisible();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByRole('button', {name: 'edit'}).click();

    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill(' ');
    await page.getByTestId('stBaseButton-primaryFormSubmit').click();
    await expect(page.getByTestId('stAlertContainer')).toContainText('Please enter both an application name and description to save changes.');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill(' ');
    await page.getByTestId('stBaseButton-primaryFormSubmit').click();
    await expect(page.getByTestId('stAlertContainer')).toContainText('Please enter both an application name and description to save changes.');

});

test('test_complete_process_checks_page_fill_answer_yes_elaboration_!=nil', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.3.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.2'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.11').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.11.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 3.12').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.12.1'}).fill('test elaboration');

    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 24 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.2'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 41 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.6.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.7.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.12.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.13.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.14.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 55 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.2'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 65 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 6 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');

    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.8.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.9.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.11.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.5.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 77 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.12.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 93 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.6.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 102 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.2.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

});

test('test_complete_process_checks_page_fill_answer_no_elaboration_!=nil', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.3.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.2'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.11.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.12.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.2'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.6.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.7.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.12.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.13.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.14.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.2'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.8.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.9.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.11.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.5.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.12.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.6.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.2.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

});

test.skip('test_complete_process_checks_page_fill_answer_na_elaboration_!=nil', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.3.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.2'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 7 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.9.1'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.2'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.6.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.7.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.12.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.13.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.14.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.2'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');

    await page.getByLabel('Implementation Status for 7.1.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.3.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.3.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.5.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.6.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.6.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.7.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.7.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.8.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.9.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.11.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('11 of 11 checks');
    await expect(page.getByText('Overall Progress: 73 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.5.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 79 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.12.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 95 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.6.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.2.1'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

});

test('test_complete_process_checks_page_fill_answer_na_elaboration_==nil', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 7 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'N/A'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'N/A'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'N/A'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'N/A'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'N/A'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'N/A'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'N/A'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'N/A'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'N/A'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'N/A'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'N/A'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'N/A'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

});

test('test_complete_process_checks_page_fill_answer_yes_elaboration_==nil', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

});

test('test_complete_process_checks_page_fill_answer_no_elaboration_==nil', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'No'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'No'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'No'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'No'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'No'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'No'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'No'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'No'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'No'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'No'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'No'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'No'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

});

test('test_complete_process_checks_page_fill_answer_mixed_elaboration_mixed', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).click();

    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).click();

    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).click();

    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.3.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.11.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.12.1'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.2'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.6.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.7.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.12.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.13.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.14.1'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.2'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.8.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.9.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.11.1'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.5.1'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.12.1'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.6.1'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.2.1'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

});

test('test_complete_process_checks_page_resume_session', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name)).toBeVisible();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency & Fill Halfway
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).click();

    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).click();

    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).click();

    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.3.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'N/A'}).locator('div').nth(1).click();

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'No'}).locator('div').nth(1).click();

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    // Press Start Over button
    await page.getByRole('button', {name: 'home icon Home'}).click();
    await page.getByRole('button', {name: 'Yes, start over'}).click();
    // Back to Home Page Attempt to Resume Session
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    //Attempt to Click Continue where you left off btn
    await page.getByTestId('stBaseButton-secondary').click();
    //Assert Resume button is disabled
    await expect(page.getByTestId('stDialog').getByTestId('stBaseButton-primary')).toBeDisabled();
    //Select Dropdownlist for Session
    await page.getByRole('combobox', {name: 'Select your previous workspace'}).fill(workspace_name);
    await page.getByRole('option', {name: workspace_name}).click();
    //Attempt to Click Cancel btn to resume Session
    await page.getByTestId('stDialog').getByTestId('stBaseButton-secondary').click();
    // Verify we are still in home page after clicking cancel
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    //Attempt to Resume Session
    //Attempt to Click Continue where you left off btn
    await page.getByTestId('stBaseButton-secondary').click();
    //Assert Resume button is disabled
    await expect(page.getByTestId('stDialog').getByTestId('stBaseButton-primary')).toBeDisabled();
    //Select Dropdownlist for Session
    await page.getByRole('combobox', {name: 'Select your previous workspace'}).fill(workspace_name);
    await page.getByRole('option', {name: workspace_name}).click();
    //Assert Resume button is Enabled and Click
    await expect(page.getByTestId('stDialog').getByTestId('stBaseButton-primary')).toBeEnabled();
    page.getByTestId('stDialog').getByTestId('stBaseButton-primary').click();

    //Assert back to Complete Process Check page
    boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    //Assert Previous Filling Still available in Session
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');

    //Continue to Fill the remaining Section of the Process Checklist
    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.11.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.12.1'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.2'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.6.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.7.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.12.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.13.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.14.1'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.2'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.8.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.9.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.11.1'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.5.1'}).fill('test elaboration');


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.12.1'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.6.1'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.2.1'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);


});

test('test_upload_technical_results_page_upload_empty_test_result', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();
    // Try to upload result files

    // Path: one level up from current directory, then into test-data
    const test_result_json_path = path.resolve(__dirname, '..', 'test-data', 'empty.json');
    // Locate the file input element.
    const fileInput = page.locator('[data-testid="stFileUploaderDropzone"] input[type="file"]');

    // Ensure the file input exists and then perform the file upload.
    await expect(fileInput).toHaveCount(1);
    await fileInput.setInputFiles(test_result_json_path);

    // Verify Error Message
    await expect(page.getByTestId('stAlertContainer')).toContainText('The uploaded file is not a valid JSON. Please upload a valid Project Moonshot JSON file.');


});

test('test_upload_technical_results_page_upload_invalid_format_test_result', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();
    // Try to upload result files

    // Path: one level up from current directory, then into test-data
    const test_result_json_path = path.resolve(__dirname, '..', 'test-data', 'invalid-test-result.json');
    // Locate the file input element.
    const fileInput = page.locator('[data-testid="stFileUploaderDropzone"] input[type="file"]');

    // Ensure the file input exists and then perform the file upload.
    await expect(fileInput).toHaveCount(1);
    await fileInput.setInputFiles(test_result_json_path);

    // Verify Error Message
    await expect(page.getByTestId('stAlertContentError').getByRole('paragraph')).toContainText('The file you uploaded isn’t in the correct format. Please upload a valid Project Moonshot JSON file.');


});

test('test_upload_technical_results_page_upload_ms_v1_test_result', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();
    // Try to upload result files

    // Path: one level up from current directory, then into test-data
    const test_result_json_path = path.resolve(__dirname, '..', 'test-data', 'ms-v1-test-result.json');
    // Locate the file input element.
    const fileInput = page.locator('[data-testid="stFileUploaderDropzone"] input[type="file"]');

    // Ensure the file input exists and then perform the file upload.
    await expect(fileInput).toHaveCount(1);
    await fileInput.setInputFiles(test_result_json_path);

    // Verify the file was uploaded.
    await expect(page.getByText('File uploaded successfully')).toBeVisible();
    await expect(page.getByTestId('stFileUploaderFileName')).toContainText('ms-v1-test-result.json');

});

test('test_upload_technical_results_page_upload_ms_v1_test_result_benchmarking', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();
    // Try to upload result files

    // Path: one level up from current directory, then into test-data
    const test_result_json_path = path.resolve(__dirname, '..', 'test-data', 'ms-v1-test-result-benchmark.json');
    // Locate the file input element.
    const fileInput = page.locator('[data-testid="stFileUploaderDropzone"] input[type="file"]');

    // Ensure the file input exists and then perform the file upload.
    await expect(fileInput).toHaveCount(1);
    await fileInput.setInputFiles(test_result_json_path);

    // Verify the file was uploaded.
    await expect(page.getByText('File uploaded successfully')).toBeVisible();
    await expect(page.getByTestId('stFileUploaderFileName')).toContainText('ms-v1-test-result-benchmark.json');

});

test('test_upload_technical_results_page_upload_ms_v1_test_result_redteaming', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();
    // Try to upload result files

    // Path: one level up from current directory, then into test-data
    const test_result_json_path = path.resolve(__dirname, '..', 'test-data', 'ms-v1-test-result-rt.json');
    // Locate the file input element.
    const fileInput = page.locator('[data-testid="stFileUploaderDropzone"] input[type="file"]');

    // Ensure the file input exists and then perform the file upload.
    await expect(fileInput).toHaveCount(1);
    await fileInput.setInputFiles(test_result_json_path);

    // Verify the file was uploaded.
    await expect(page.getByText('File uploaded successfully')).toBeVisible();
    await expect(page.getByTestId('stFileUploaderFileName')).toContainText('ms-v1-test-result-rt.json');

});

test('test_upload_technical_results_page_upload_ms_v0.6_test_result', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();
    // Try to upload result files

    // Path: one level up from current directory, then into test-data
    const test_result_json_path = path.resolve(__dirname, '..', 'test-data', 'ms-v0.6-test-result.json');
    // Locate the file input element.
    const fileInput = page.locator('[data-testid="stFileUploaderDropzone"] input[type="file"]');

    // Ensure the file input exists and then perform the file upload.
    await expect(fileInput).toHaveCount(1);
    await fileInput.setInputFiles(test_result_json_path);

    // Verify the file was uploaded.
    await expect(page.getByText('File uploaded successfully')).toBeVisible();
    await expect(page.getByTestId('stFileUploaderFileName')).toContainText('ms-v0.6-test-result.json');

});

test('test_upload_technical_results_page_download_sample_files', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();

    // Checkpoint - check download link feature on Upload Technical Results Page for Json
    // Try download
    const [download] = await Promise.all([
        page.waitForEvent('download'),  // Wait for the download event
        await page.getByRole('listitem').filter({hasText: 'If you are using Moonshot version 1.0, you can download the sample result here.'}).getByRole('link').click(),
    ]);

    // Get the suggested filename and save the file to the current directory
    const filename = download.suggestedFilename();
    expect(filename == "ms_v0.6_result_template.json")

    const [download2] = await Promise.all([
        page.waitForEvent('download'),  // Wait for the download event
        await page.getByRole('listitem').filter({hasText: 'If you are using Moonshot version 1.0, you can download the sample result here.'}).getByRole('link').click(),
    ]);

    // Get the suggested filename and save the file to the current directory
    const filename2 = download2.suggestedFilename();
    expect(filename2 == "ms_ga_result_template.json")

});

test('test_upload_technical_results_page_home_btn', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();

    await page.getByRole('button', {name: 'home icon Home'}).click();
    await page.getByRole('button', {name: 'Yes, start over'}).click();
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

});

test('test_upload_technical_results_page_click_back_btn', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();

    await page.getByRole('button', {name: '← Back'}).click();
    await expect(page.getByTestId('stExpander').locator('span')).toContainText('Instructions');
    boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

});


test('test_upload_generate_report_page', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();
    // Try to upload result files

    // Path: one level up from current directory, then into test-data
    const test_result_json_path = path.resolve(__dirname, '..', 'test-data', 'ms-v1-test-result.json');
    // Locate the file input element.
    const fileInput = page.locator('[data-testid="stFileUploaderDropzone"] input[type="file"]');

    // Ensure the file input exists and then perform the file upload.
    await expect(fileInput).toHaveCount(1);
    await fileInput.setInputFiles(test_result_json_path);

    // Verify the file was uploaded.
    await expect(page.getByText('File uploaded successfully')).toBeVisible();
    await expect(page.getByTestId('stFileUploaderFileName')).toContainText('ms-v1-test-result.json');

    // Click next page button
    await page.getByRole('button', {name: 'Next →'}).click();

    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('5', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Generate Your Technical Report'})).toBeVisible();

    //Attempt to edit Workspace information
    await page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByRole('button', {name: 'edit'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name_edit');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name_edit');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description_edit');
    await page.getByTestId('stBaseButton-primaryFormSubmit').click();
    // Verify changes is updated
    await expect(page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByText('company_name_edit')).toBeVisible();
    await expect(page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByText('application_name_edit')).toBeVisible();
    await expect(page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByText('application_description_edit')).toBeVisible();

    // Download button hidden before clicking generate report button
    await expect(page.getByTestId('stDownloadButton').getByTestId('stBaseButton-secondary')).toBeHidden();

    // Click Preview Report Button
    await page.getByRole('button', {name: 'Preview Report'}).click();

    //Verify Download PDF button visible to user for download
    await expect(page.getByTestId('stDownloadButton').getByTestId('stBaseButton-secondary')).toBeVisible();

    const [download] = await Promise.all([
        page.waitForEvent('download'),  // Wait for the download event
        page.getByTestId('stDownloadButton').getByTestId('stBaseButton-secondary').click(),
    ]);

    // Get the suggested filename and save the file to the current directory
    const filename = download.suggestedFilename();
    expect(filename == "technical_report.pdf")
});
test('test_upload_generate_report_page_edit_workspace_information==empty', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();
    // Try to upload result files

    // Path: one level up from current directory, then into test-data
    const test_result_json_path = path.resolve(__dirname, '..', 'test-data', 'ms-v1-test-result.json');
    // Locate the file input element.
    const fileInput = page.locator('[data-testid="stFileUploaderDropzone"] input[type="file"]');

    // Ensure the file input exists and then perform the file upload.
    await expect(fileInput).toHaveCount(1);
    await fileInput.setInputFiles(test_result_json_path);

    // Verify the file was uploaded.
    await expect(page.getByText('File uploaded successfully')).toBeVisible();
    await expect(page.getByTestId('stFileUploaderFileName')).toContainText('ms-v1-test-result.json');

    // Click next page button
    await page.getByRole('button', {name: 'Next →'}).click();

    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('5', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Generate Your Technical Report'})).toBeVisible();

    //Attempt to edit Workspace information
    await page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByRole('button', {name: 'edit'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('');
    await page.getByTestId('stBaseButton-primaryFormSubmit').click();
    // Verify Error Message
    await expect(page.getByTestId('stAlertContentError').getByRole('paragraph')).toContainText('Please provide a valid Company Name, Application Name, Application Description to proceed with saving changes.');


});
test('test_upload_generate_report_page_home_btn', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();

    // Click next page button
    await page.getByRole('button', {name: 'Next →'}).click();

    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('5', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Generate Your Technical Report'})).toBeVisible();

    //Attempt to edit Workspace information
    await page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByRole('button', {name: 'edit'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name_edit');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name_edit');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description_edit');
    await page.getByTestId('stBaseButton-primaryFormSubmit').click();
    // Verify changes is updated
    await expect(page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByText('company_name_edit')).toBeVisible();
    await expect(page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByText('application_name_edit')).toBeVisible();
    await expect(page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByText('application_description_edit')).toBeVisible();

    // Download button hidden before clicking generate report button
    await expect(page.getByTestId('stDownloadButton').getByTestId('stBaseButton-secondary')).toBeHidden();

    // Click Preview Report Button
    await page.getByRole('button', {name: 'Preview Report'}).click();

    //Verify Download PDF button visible to user for download
    await expect(page.getByTestId('stDownloadButton').getByTestId('stBaseButton-secondary')).toBeVisible({timeout: 5000});

    const [download] = await Promise.all([
        page.waitForEvent('download'),  // Wait for the download event
        page.getByTestId('stDownloadButton').getByTestId('stBaseButton-secondary').click(),
    ]);

    // Get the suggested filename and save the file to the current directory
    const filename = download.suggestedFilename();
    expect(filename == "technical_report.pdf")

    await page.getByRole('button', {name: 'home icon Home'}).click();
    await page.getByRole('button', {name: 'Yes, start over'}).click();
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
});
test('test_upload_generate_report_page_click_back_btn', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();

    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()

    await page.getByLabel('Implementation Status for 3.11.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByLabel('Implementation Status for 3.12.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click()
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click()


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click()
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click()

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('4', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();

    // Click next page button
    await page.getByRole('button', {name: 'Next →'}).click();

    // Check Steps UI contains 'active'
    boxStep4 = page.getByText('5', {exact: true});
    await expect(boxStep4).toHaveClass(/active/);

    await expect(page.getByRole('heading', {name: 'Generate Your Technical Report'})).toBeVisible();

    //Attempt to edit Workspace information
    await page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByRole('button', {name: 'edit'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name_edit');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name_edit');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description_edit');
    await page.getByTestId('stBaseButton-primaryFormSubmit').click();
    // Verify changes is updated
    await expect(page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByText('company_name_edit')).toBeVisible();
    await expect(page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByText('application_name_edit')).toBeVisible();
    await expect(page.locator('[data-testid="stCustomComponentV1"]').contentFrame().getByText('application_description_edit')).toBeVisible();

    // Download button hidden before clicking generate report button
    await expect(page.getByTestId('stDownloadButton').getByTestId('stBaseButton-secondary')).toBeHidden();

    // Click Preview Report Button
    await page.getByRole('button', {name: 'Preview Report'}).click();

    //Verify Download PDF button visible to user for download
    await expect(page.getByTestId('stDownloadButton').getByTestId('stBaseButton-secondary')).toBeVisible();

    const [download] = await Promise.all([
        page.waitForEvent('download'),  // Wait for the download event
        page.getByTestId('stDownloadButton').getByTestId('stBaseButton-secondary').click(),
    ]);

    // Get the suggested filename and save the file to the current directory
    const filename = download.suggestedFilename();
    expect(filename == "technical_report.pdf")

    await page.getByRole('button', {name: '← Back'}).click();
    await expect(page.getByRole('heading', {name: 'Upload Technical Test Results'})).toBeVisible();
});

test('test_complete_process_checks_page_export_checklist', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    // Fill Transparency
    await expect(page.getByRole('heading', {name: 'Transparency'})).toBeVisible();
    await page.getByLabel('Implementation Status for 1.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.5'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.1.6'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.3').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.3.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 1.7.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.1'}).fill("test elaboration");

    await page.getByLabel('Implementation Status for 1.7.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 1.7.2'}).fill("test elaboration");
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();


    //Assert Complete Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-0')).toContainText('13 of 13 checks');


    //Explainability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Explainability 0 of 1 checks').click();
    await expect(page.locator('#transparency')).toContainText('Explainability');
    await page.locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for'}).fill('test elaboration');
    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-1')).toContainText('1 of 1 checks');
    await expect(page.getByText('Overall Progress: 14 of 104')).toBeVisible();


    //Reproducibility Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Reproducibility 0 of 10 checks').click();
    await expect(page.getByRole('heading', {name: 'Reproducibility'})).toBeVisible();

    await page.getByLabel('Implementation Status for 3.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.2').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.4').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.5').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.7').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.8').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 3.9').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.9.1'}).fill('test elaboration');

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-2')).toContainText('7 of 7 checks');
    await expect(page.getByText('Overall Progress: 21 of 104')).toBeVisible();


    //Safety Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Safety 0 of 17 checks').click();
    await expect(page.locator('#transparency')).toContainText('Safety');

    await page.getByLabel('Implementation Status for 4.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.1').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.2').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.6.3').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.6.4').locator('div').filter({hasText: 'Yes'}).first().click();

    await page.getByRole('textbox', {name: 'Elaboration for 4.6.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.7').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.8').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 4.9.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.9.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 4.10.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 4.10.2'}).fill('test elaboration');

    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-3')).toContainText('17 of 17 checks');
    await expect(page.getByText('Overall Progress: 38 of 104')).toBeVisible();


    //Security Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Security 0 of 14 checks').click();
    await expect(page.locator('#transparency')).toContainText('Security');

    await page.getByLabel('Implementation Status for 5.1.1').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.5').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.6').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.6.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.7').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.7.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 5.8').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.12.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.12.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.13.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.13.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 5.14.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 5.14.1'}).fill('test elaboration');

    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 52 of 104')).toBeVisible();

    //Robustness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Robustness 0 of 10 checks').click();
    await expect(page.locator('#transparency')).toContainText('Robustness');

    await page.getByLabel('Implementation Status for 6.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 6.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.6.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.6.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 6.7.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 6.7.2'}).fill('test elaboration');

    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-5')).toContainText('10 of 10 checks');
    await expect(page.getByText('Overall Progress: 62 of 104')).toBeVisible();

    //Fairness Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Fairness 0 of 11 checks').click();
    await expect(page.locator('#transparency')).toContainText('Fairness');


    await page.getByLabel('Implementation Status for 7.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.4.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 7.8.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.8.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.9.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.10.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 7.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 7.11.1'}).fill('test elaboration');

    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-6')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 71 of 104')).toBeVisible();


    //Data Governance Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Data Governance 0 of 6 checks').click();
    await expect(page.getByRole('heading', {name: 'Data Governance'})).toBeVisible();


    await page.getByLabel('Implementation Status for 8.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.2.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 8.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 8.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 8.5.1'}).fill('test elaboration');

    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-7')).toContainText('6 of 6 checks');
    await expect(page.getByText('Overall Progress: 74 of 104')).toBeVisible();


    //Accountability Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Accountability 0 of 16 checks').click();
    await expect(page.getByRole('heading', {name: 'Accountability'})).toBeVisible();


    await page.getByLabel('Implementation Status for 9.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.1.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.10.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.10.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 9.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.3'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.5.4').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.5.4'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.6.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.7.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.7.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.8.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.8.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.9.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.9.2'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.11.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.11.1'}).fill('test elaboration');

    await page.getByLabel('Implementation Status for 9.12.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 9.12.1'}).fill('test elaboration');

    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-8')).toContainText('16 of 16 checks');
    await expect(page.getByText('Overall Progress: 90 of 104')).toBeVisible();


    //Human Agency & Oversight Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('10 Human Agency & Oversight 0').click();
    await expect(page.getByRole('heading', {name: 'Human Agency & Oversight'})).toBeVisible();


    await page.getByLabel('Implementation Status for 10.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.2.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.2.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.2').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.2'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.3.3').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.3.3'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.4.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.4.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.5.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.5.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 10.6.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 10.6.1'}).fill('test elaboration');

    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-9')).toContainText('9 of 9 checks');
    await expect(page.getByText('Overall Progress: 99 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeDisabled();


    //Inclusive Growth, Societal And Environmental Well-Being Fill Answer
    await page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().getByText('Inclusive Growth, Societal And Environmental Well-Being 0 of 2 checks').click();
    await expect(page.getByRole('heading', {name: 'Inclusive Growth, Societal'})).toBeVisible();


    await page.getByLabel('Implementation Status for 11.1.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.1.1'}).fill('test elaboration');
    await page.getByLabel('Implementation Status for 11.2.1').locator('div').filter({hasText: 'Yes'}).first().click();
    await page.getByRole('textbox', {name: 'Elaboration for 11.2.1'}).fill('test elaboration');

    await page.getByRole('progressbar', {name: '% Loaded'}).locator('div').nth(1).click();

    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-10')).toContainText('2 of 2 checks');
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();

    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

    // Checkpoint - check download link feature on Getting Started Page for Excel
    // Checkpoint - check download link feature on Getting Started Page for PDF
    // ✅ Handle the PDF link as a download
    const downloadPromise = page.waitForEvent('download');

    // Click the link (triggers the download)
    await page.getByTestId('stDownloadButton').getByTestId('stTooltipHoverTarget').getByTestId('stBaseButton-secondary').click();

    // Wait for the download to complete
    const download = await downloadPromise;

    // Confirm the download URL
    const downloadUrl = download.suggestedFilename()
    console.log('PDF Download URL:', downloadUrl);

    // Assert the expected download URL
    // Get today's date in YYYY_MM_DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0].replace(/-/g, '_'); // e.g., "2025_05_14"

    // Build dynamic regex for filename
    const expectedPrefix = `process_checks_${formattedDate}`;
    const regex = new RegExp(`^${expectedPrefix}.*\\.xlsx$`);

    // Assert the filename matches
    expect(downloadUrl).toMatch(regex);


});

test('test_complete_process_checks_page_import_checklist', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    console.log(workspace_name)
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Checks for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();

    const boxStep1 = page.getByText('1', {exact: true});
    await expect(boxStep1).toHaveClass(/active/);
    let boxStep2 = page.getByText('2');

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    boxStep2 = page.getByText('2', {exact: true});
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.getByRole('heading', {name: 'Understand the testing'})).toBeVisible();

    let boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Next →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);
    await expect(page.getByText('Provide Workspace Details')).toBeVisible();
    await page.getByRole('textbox', {name: 'Company Name'}).click();
    await page.getByRole('textbox', {name: 'Company Name'}).fill('company_name');
    await page.getByRole('textbox', {name: 'Application Name'}).click();
    await page.getByRole('textbox', {name: 'Application Name'}).fill('application_name');
    await page.getByRole('textbox', {name: 'Application Description'}).click();
    await page.getByRole('textbox', {name: 'Application Description'}).fill('application_description');
    await page.getByRole('textbox', {name: 'Workspace Name'}).click();
    await page.getByRole('textbox', {name: 'Workspace Name'}).fill(workspace_name);
    await page.getByTestId('stBaseButton-primary').click();

    let boxStep4 = page.getByText('4', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep4).toHaveClass(/inactive/);

    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_name')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText('application_description')).toBeVisible();
    await page.locator('iframe[title="backend\\.actions_components\\.actions_component\\.actions_component"]').contentFrame().getByText(workspace_name).click();
    await expect(page.getByTestId('stExpander').getByText('Instructions')).toBeVisible();

    await expect(page.getByText('Overall Progress: 0 of 104')).toBeVisible();
    // Try to upload process checklist Excel file

    // Path: one level up from current directory, then into test-data
    const test_result_json_path = path.resolve(__dirname, '..', 'test-data', 'process_checks_2025_05_14_13_04_03.xlsx');
    // Locate the file input element.
    const fileInput = await page.locator('input[type="file"]');
    // Ensure the file input exists and then perform the file upload.
    await page.getByRole('button', {name: 'file_upload Import from Excel'}).click();
    await expect(fileInput).toHaveCount(1);
    await page.getByTestId('stFileUploaderDropzone').getByTestId('stBaseButton-secondary').click();
    await fileInput.setInputFiles(test_result_json_path);

    await page.getByTestId('stDialog').getByRole('button', {name: 'Import'}).click();


    //Assert Populated for the checklist
    await expect(page.getByText('Overall Progress: 104 of 104')).toBeVisible();
    await expect(page.getByRole('button', {name: 'Next →'})).toBeEnabled();

});
