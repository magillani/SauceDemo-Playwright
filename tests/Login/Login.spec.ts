import { test, expect } from '@playwright/test';

const loginURL = ('https://www.saucedemo.com/');
const validUsername = ('standard_user');
const validPassword = ('secret_sauce');

// ==============================
// Positive Login Scenarios
// ==============================

test.describe('SauceDemo Login - Positive Test Scenarios', () => {


    // Verify that the SauceDemo login page loads successfully
    test('PW-001 Verify SauceDemo login page loads.', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);


        // Verify that the page title is "Swag Labs"
        await expect(page).toHaveTitle('Swag Labs');

    });

    // Verify that the Username and password fields are visible
    test('PW-002 Verify User Name and Password fields are visible.', async ({ page }) => {
        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        //Verify the username is visible
        await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();

        //Verify the password is visible
        await expect(page.getByPlaceholder('Password')).toBeVisible();

        //Verify the Login button is visible
        await expect(page.getByRole('button')).toBeVisible();

        //Verify the Accepted usernames are visible
        await expect(page.locator('[data-test="login-credentials"]')).toContainText('Accepted usernames are:');

    });

    test('PW-003 Verify all accepted usernames are displayed.', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        const credentials = await page.locator('[data-test="login-credentials"]');

        // Verify the section heading contains the text "Accepted usernames are:"
        await expect(credentials).toContainText('Accepted usernames are:');

        //Verify each accepted usernames are displayed
        await expect(credentials).toContainText('standard_user');
        await expect(credentials).toContainText('locked_out_user');
        await expect(credentials).toContainText('problem_user');
        await expect(credentials).toContainText('performance_glitch_user');
        await expect(credentials).toContainText('error_user');
        await expect(credentials).toContainText('visual_user');

        const passwords = await page.locator('[data-test="login-password"]');

        // Verify the section heading contains the text "Password for all users:"
        await expect(passwords).toContainText('Password for all users:');

        //Verify each accepted password is displayed
        await expect(passwords).toContainText('secret_sauce');

    });

    test('PW-004 Verify login page URL', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        // Verify that the current URL is "https://www.saucedemo.com/"
        await expect(page).toHaveURL('https://www.saucedemo.com/');

    });

    test('PW-005 Verify to Login with valid standard user.', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        // Enter the valid username
        await page.getByRole('textbox', { name: 'Username' }).fill(validUsername);

        // Enter the valid password
        await page.getByPlaceholder('Password').fill(validPassword);

        // Click the Login button
        await page.getByRole('button', { name: 'Login' }).click();

        // Verify that the user is redirected to the inventory page
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    });

    test('PW-011 Verify to Logout the user.', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        // Enter the valid username
        await page.getByRole('textbox', { name: 'Username' }).fill(validUsername);

        // Enter the valid password
        await page.getByPlaceholder('Password').fill(validPassword);

        // Click the Login button
        await page.getByRole('button', { name: 'Login' }).click();

        // Verify that the user is redirected to the inventory page
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

        // Open the navigation menu
        await expect(page.getByText('Open Menu')).toBeVisible();
        await page.getByText('Open Menu').click();

        // Click Logout
        await page.getByRole('link', { name: 'Logout' }).click();

        // Verify that the user is redirected to the login page
        await expect(page).toHaveURL('https://www.saucedemo.com/');

    });

});


// ==============================
// Negaive Login Scenarios
// ==============================

test.describe('SauceDemo Login - Negative Test Scenarios', () => {

    test('PW-006 Verify error message for invalid username and password.', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        // Enter the valid username
        await page.getByRole('textbox', { name: 'Username' }).fill('admin123');

        // Enter the valid password
        await page.getByPlaceholder('Password').fill('admin123');

        // Click the Login button
        await page.getByRole('button', { name: 'Login' }).click();


        // Verify that the error message is displayed
        const ErrorMessageforInvalid = "Epic sadface: Username and password do not match any user in this service";
        const ValidationonInvaidUserPassword = page.locator('[data-test="error"]');
        await expect(ValidationonInvaidUserPassword).toBeVisible();
        await expect(ValidationonInvaidUserPassword).toContainText(ErrorMessageforInvalid);

        //Verify the validation icon in red color appears for invalid username and password
        const RedIconInvalidUser = page.locator('[data-test="username"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidUser).toBeVisible();
        await expect(RedIconInvalidUser).toHaveCSS('color', 'rgb(226, 35, 26)');

        // Verify the validation icon appears for the password
        const RedIconInvalidPassword = page.locator('[data-test="password"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidPassword).toBeVisible();
        await expect(RedIconInvalidPassword).toHaveCSS('color', 'rgb(226, 35, 26)');

    });

    test('PW-007 Verify error message for an empty username.', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        const EmptyUserName = "";


        // Enter the Empty username
        await page.getByRole('textbox', { name: 'Username' }).fill(EmptyUserName);

        // Enter the valid password
        await page.getByPlaceholder('Password').fill(validPassword);

        // Click the Login button
        await page.getByRole('button', { name: 'Login' }).click();

        // Verify that the error message is displayed for empty username
        const ErroronEmptyUserPass = "Epic sadface: Username is required";
        const PageerrorMessage = await page.locator('[data-test="error"]');
        await expect(PageerrorMessage).toBeVisible();
        await expect(PageerrorMessage).toContainText(ErroronEmptyUserPass);

        //Verify the validation icon in red color appears for empty username and password
        const RedIconInvalidUser = page.locator('[data-test="username"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidUser).toBeVisible();
        await expect(RedIconInvalidUser).toHaveCSS('color', 'rgb(226, 35, 26)');

        // Verify the validation icon appears for the password
        const RedIconInvalidPassword = page.locator('[data-test="password"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidPassword).toBeVisible();
        await expect(RedIconInvalidPassword).toHaveCSS('color', 'rgb(226, 35, 26)');


    });

    test('PW-008 Verify error message for an empty password.', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        const EmptyPassword = "";


        // Enter the valid username
        await page.getByRole('textbox', { name: 'Username' }).fill(validUsername);

        // Enter the valid password
        await page.getByPlaceholder('Password').fill(EmptyPassword);

        // Click the Login button
        await page.getByRole('button', { name: 'Login' }).click();

        // Verify that the error message is displayed for empty password
        const passwordRequiredMessage = "Epic sadface: Password is required";
        const PageerrorMessage = page.locator('[data-test="error"]');
        await expect(PageerrorMessage).toBeVisible();
        await expect(PageerrorMessage).toContainText(passwordRequiredMessage);

        //Verify the validation icon in red color appears for empty username and password
        const RedIconInvalidUser = page.locator('[data-test="username"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidUser).toBeVisible();
        await expect(RedIconInvalidUser).toHaveCSS('color', 'rgb(226, 35, 26)');

        // Verify the validation icon appears for the password
        const RedIconInvalidPassword = page.locator('[data-test="password"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidPassword).toBeVisible();
        await expect(RedIconInvalidPassword).toHaveCSS('color', 'rgb(226, 35, 26)');

    });

    test('PW-009 Verify error messages for empty username and password fields.', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        const EmptyPassword = "";
        const EmptyUserName = "";

        // Enter the valid username
        await page.getByRole('textbox', { name: 'Username' }).fill(EmptyUserName);

        // Enter the valid password
        await page.getByPlaceholder('Password').fill(EmptyPassword);

        // Click the Login button
        await page.getByRole('button', { name: 'Login' }).click();

        // Verify that the error message is displayed for empty password
        const ErroronEmptyUserPass = "Epic sadface: Username is required";
        const PageerrorMessage = await page.locator('[data-test="error"]');
        await expect(PageerrorMessage).toBeVisible();
        await expect(PageerrorMessage).toContainText(ErroronEmptyUserPass);

        //Verify the validation icon in red color appears for empty username and password
        const RedIconInvalidUser = page.locator('[data-test="username"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidUser).toBeVisible();
        await expect(RedIconInvalidUser).toHaveCSS('color', 'rgb(226, 35, 26)');

        // Verify the validation icon appears for the password
        const RedIconInvalidPassword = page.locator('[data-test="password"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidPassword).toBeVisible();
        await expect(RedIconInvalidPassword).toHaveCSS('color', 'rgb(226, 35, 26)');
    });


    test('PW-010 Verify to Login with locked-out user.', async ({ page }) => {

        // Navigate to the SauceDemo website
        await page.goto(loginURL);

        // Enter the valid username
        await page.getByRole('textbox', { name: 'Username' }).fill('locked_out_user');

        // Enter the valid password
        await page.getByPlaceholder('Password').fill('secret_sauce');

        // Click the Login button
        await page.getByRole('button', { name: 'Login' }).click();

        // Verify that the error message displays for locked user name.
        const ErrorOnLockedUser = "Epic sadface: Sorry, this user has been locked out.";
        const PageerrorMessage = await page.locator('[data-test="error"]');
        await expect(PageerrorMessage).toBeVisible();
        await expect(PageerrorMessage).toContainText(ErrorOnLockedUser);

        //Verify the validation icon in red color appears for locked username.
        const RedIconInvalidUser = page.locator('[data-test="username"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidUser).toBeVisible();
        await expect(RedIconInvalidUser).toHaveCSS('color', 'rgb(226, 35, 26)');

        // Verify the validation icon appears for the password
        const RedIconInvalidPassword = page.locator('[data-test="password"] + svg');

        // Verify that the red icon is visible and has the correct color
        await expect(RedIconInvalidPassword).toBeVisible();
        await expect(RedIconInvalidPassword).toHaveCSS('color', 'rgb(226, 35, 26)');
    });
});
