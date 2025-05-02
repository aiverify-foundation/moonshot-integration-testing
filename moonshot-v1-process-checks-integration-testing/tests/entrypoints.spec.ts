import {test, expect} from '@playwright/test';

test('test_welcome_page', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
    await page.getByTestId('stBaseButton-primary').click();
    await expect(page.getByRole('heading', {name: 'AI Verify Testing Framework'})).toBeVisible();
    await expect(page.getByRole('heading', {name: 'How can the Testing Framework'})).toBeVisible();

});

test('test_getting_started_page', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
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

    //Checkpoint - check download link feature on Getting Started Page
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', {name: 'Download Testing Framework - PDF'}).click();
    const page1 = await page1Promise;
    console.log('Current URL:', page1.url());
    await expect
    await expect(page1.url()).toBe("https://www.cpf.gov.sg/content/dam/web/member/faq/general-information---useful-tips/documents/Guide_to_view_and_save_CPF_statements.pdf")

});

test('test_getting_started_page_click_start_over_btn', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
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
    await page.getByRole('button', {name: '↺ Start Over'}).click();
    await page.getByRole('button', {name: 'Yes, start over'}).click();
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
});

test('test_getting_started_page_click_back_btn', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
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
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
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

});

test('test_complete_process_checks_page_click_start_over_btn', async ({page}) => {
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
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
    await page.getByRole('button', {name: '↺ Start Over'}).click();
    await page.getByRole('button', {name: 'Yes, start over'}).click();
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
});
test('test_complete_process_checks_page_click_back_btn', async ({page}) => {
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
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
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
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

test('test_complete_process_checks_page_fill_answer_yes_elaboration_!=nil', async ({page}) => {
    test.setTimeout(1200000);
    let workspace_name = 'workspace_1' + Math.floor(Math.random() * 1000000000);
    await page.goto('http://127.0.0.1:8501');
    await expect(page.getByRole('heading', {name: 'Welcome to Process Check for'})).toBeVisible();
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

    await page.getByLabel('Implementation Status for 3.6').locator('label').filter({hasText: 'Yes'}).locator('div').nth(1).click();
    await page.getByRole('textbox', {name: 'Elaboration for 3.6.1'}).fill('test elaboration');

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


    // Assert Completed Filling
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4').getByText('✓')).toBeVisible();
    await expect(page.locator('iframe[title="backend\\.cards_component\\.cards_component\\.cards_component"]').contentFrame().locator('#card-4')).toContainText('14 of 14 checks');
    await expect(page.getByText('Overall Progress: 55 of 104')).toBeVisible();

});