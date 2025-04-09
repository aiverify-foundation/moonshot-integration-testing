import {test, expect} from '@playwright/test';

test('test_welcome_page', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.locator('#welcome-to-ai-verify-testing-framework-for-generative-ai')).toContainText('Welcome to AI Verify Testing Framework for Generative AI');

    const boxStep2 = page.getByText('2', {exact: true});

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByTestId('stBaseButton-secondary').click();
    // Check Steps UI contains 'active'
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.locator('[id="\\31 -understand-the-testing-framework"]')).toContainText('1. Understand the testing framework');

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Let\'s Begin →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);

    //Checkpoint - Back button is working correctly and Back to Welcome Page
    await page.getByRole('button', { name: '← Back' }).click();

    await expect(page.locator('#welcome-to-ai-verify-testing-framework-for-generative-ai')).toContainText('Welcome to AI Verify Testing Framework for Generative AI');
});

test('test_getting_started_page', async ({page}) => {
    await page.goto('http://127.0.0.1:8501');
    await expect(page.locator('#welcome-to-ai-verify-testing-framework-for-generative-ai')).toContainText('Welcome to AI Verify Testing Framework for Generative AI');

    const boxStep2 = page.getByText('2', {exact: true});

    //Checkpoint - Click Next button reach to Getting Started Page
    // Check Steps UI contains 'inactive'
    await expect(boxStep2).toHaveClass(/inactive/);
    await page.getByTestId('stBaseButton-secondary').click();
    // Check Steps UI contains 'active'
    await expect(boxStep2).toHaveClass(/active/);
    await expect(page.locator('[id="\\31 -understand-the-testing-framework"]')).toContainText('1. Understand the testing framework');

    //Checkpoint - check download link feature on Getting Started Page
    const page1Promise = page.waitForEvent('popup');
    await page.getByRole('link', {name: 'Download Testing Framework'}).click();
    const page1 = await page1Promise;
    console.log('Current URL:', page1.url());
    await expect
    await expect(page1.url()).toBe( "https://www.cpf.gov.sg/content/dam/web/member/faq/general-information---useful-tips/documents/Guide_to_view_and_save_CPF_statements.pdf")

    const boxStep3 = page.getByText('3', {exact: true});
    // Check Steps UI contains 'inactive'
    await expect(boxStep3).toHaveClass(/inactive/);
    await page.getByRole('button', {name: 'Let\'s Begin →'}).click();
    // Check Steps UI contains 'active'
    await expect(boxStep3).toHaveClass(/active/);

});