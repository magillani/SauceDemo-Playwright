import { test, expect } from '@playwright/test';

//==============================
// Positive Inventory Scenarios
// ==============================

test.describe('Inventory - Positive Scenarios', () => {

    const validUsername = 'standard_user';
    const validPassword = 'secret_sauce';
    const loginURL = 'https://www.saucedemo.com/';
    const inventoryURL = 'https://www.saucedemo.com/inventory.html';

    test.beforeEach(async ({ page }) => {
        await page.goto(loginURL);   // Navigate to the SauceDemo website
        await page.getByRole('textbox', { name: 'Username' }).fill(validUsername);  // Enter the valid username      
        await page.getByPlaceholder('Password').fill(validPassword);  // Enter the valid password
        await page.getByRole('button', { name: 'Login' }).click();  // Click the Login button
        await expect(page).toHaveURL(inventoryURL);  // Verify that the user is redirected to the inventory page
        await expect(page.getByText('Products', { exact: true })).toBeVisible();  // Verify that the Products heading is visible
    });


    test('PW-013 Verify inventory page opens after login.', async ({ page }) => {

        // Verify that the Products heading is visible
        await expect(page.getByText('Products', { exact: true })).toBeVisible();

    });

    test('PW-014 Verify all products are displayed.', async ({ page }) => {

        // Locate all the product elements.
        const products = page.locator('[data-test="inventory-item"]');
        const productCount = 6; // Expected number of products

        // Verify that all 6 products are displayed
        await expect(products).toHaveCount(productCount);
    });


    test('PW-015 Verify product names are visible.', async ({ page }) => {

        // Locate all the product Names.
        const productNames = page.locator('[data-test="inventory-item-name"]');

        // Verify that all product names are visible
        for (const product of await productNames.all()) {
            await expect(product).toBeVisible();
            console.log(await product.innerText());
        }

    });


    test('PW-016 Verify product prices are visible.', async ({ page }) => {

        const Products = page.locator('[data-test="inventory-item"]');

        // Verify that all product names are visible
        for (const product of await Products.all()) {

            const productName = product.locator('[data-test="inventory-item-name"]');
            const productPrice = product.locator('[data-test="inventory-item-price"]');

            await expect(productName).toBeVisible();
            await expect(productPrice).toBeVisible();

            console.log(await productName.innerText(), '-', await productPrice.innerText());
        }
    });

    test('PW-017 Verify product descriptions are visible.', async ({ page }) => {
        const Products = page.locator('[data-test="inventory-item"]');
        // Verify that all product names are visible
        for (const product of await Products.all()) {
            const productName = product.locator('[data-test="inventory-item-name"]');
            const productDescription = product.locator('[data-test="inventory-item-desc"]');
            await expect(productName).toBeVisible();
            await expect(productDescription).toBeVisible();
            console.log(await productName.innerText(), '-', await productDescription.innerText());
        }
    });

    test('PW-018 Verify to Open a product detail page.', async ({ page }) => {

        const productName = page.locator('[data-test="inventory-item-name"]').first();

        await productName.click();

        // Verify product detail page opens
        await expect(page).toHaveURL(/inventory-item/);

        // Verify product details are visible
        const ItemName = page.locator('[data-test="inventory-item-name"]');
        const ItemDescription = page.locator('[data-test="inventory-item-desc"]');
        const ItemPrice = page.locator('[data-test="inventory-item-price"]');

        await expect(ItemName).toBeVisible();
        await expect(ItemDescription).toBeVisible();
        await expect(ItemPrice).toBeVisible();
        console.log(await ItemName.innerText(), '\n', await ItemDescription.innerText(), '\n', await ItemPrice.innerText());
    });

    test('PW-019 Verify to Return from product detail to inventory.', async ({ page }) => {

        // Open the first product
        const productName = page.locator('[data-test="inventory-item-name"]').first();
        await productName.click();

        // Verify that the product detail page Preview Successfully.
        await expect(page).toHaveURL(/inventory-item/);
        console.log(await expect(page).toHaveURL(/inventory-item/));

        //Verify the product's names, description and price is visible
        await expect(productName).toBeVisible();
        await expect(page.locator('[data-test="inventory-item-desc"]')).toBeVisible();
        await expect(page.locator('[data-test="inventory-item-price"]')).toBeVisible();


        // Click Back to products
        await page.getByRole('button', { name: 'Back to products' }).click();

        // Verify that the user is returned to the inventory page
        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

        // Verify that the Products heading is visible
        await expect(page.getByText('Products', { exact: true })).toBeVisible();



    })


    test('PW-020 Verify adding one product to cart..', async ({ page }) => {

        await expect(page).toHaveURL(/inventory-item/); // Verify product detail page opens

        const productName = page.locator('[data-test="inventory-item-name"]');
        const ProductDescription = page.locator('[data-test="inventory-item-desc"]');
        const ProductPrice = page.locator('[data-test="inventory-item-price"]');
        const ProductImage = page.getByRole('img', { name: 'Sauce Labs Backpack' });
        await expect(ProductImage).toBeVisible();
        await productName.first().click();


        // Verify the 'Add to Cart' button is visibale
        const AddToCartBtn = page.getByRole('button', { name: 'Add to cart' });
        await expect(AddToCartBtn).toBeVisible();
        await AddToCartBtn.click();

        // Verify the Once the product is added to the cart, The 'Add to Ccart' shouldn't be visible
        await expect(AddToCartBtn).toBeHidden();

        //Verify Once Product is added to Card, A Remove button shoud be visible and clickable
        const RemoveBtn = page.getByRole('button', { name: 'Remove' });
        await expect(RemoveBtn).toHaveText('Remove');
        await expect(RemoveBtn).toBeVisible();
        await expect(RemoveBtn).toBeEnabled();


        // Verify the Once the product is added to the cart, The 'Add to Ccart' should preview as '1' in the cart.
        const CartIcon = page.locator('[data-test="shopping-cart-link"]');
        await expect(CartIcon).toBeVisible();
        await expect(CartIcon).toHaveText('1');
        await CartIcon.click();

        // Verify the Cart Page Opens successfully
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
        const CartTitle = expect(page.getByText('Your Cart'));
        expect(CartTitle).toContain('Your Cart');

        const CartProductName = page.getByText('Sauce Labs Backpack');
        const CartProdctDescription = page.locator('[data-test="inventory-item-desc"]');
        const CartProductPrice = page.locator('[data-test="inventory-item-price"]');

        expect(productName).toBe(await CartProductName.innerText());
        expect(ProductDescription).toBe(await CartProdctDescription.innerText());
        expect(ProductPrice).toBe(await CartProductPrice.innerText());

    });

});







//==============================
// Negative Inventory Scenarios
// ==============================

test.describe('Inventory - Negative Scenarios', () => {

    test('PW-115 Verify all.', async ({ page }) => {

        // PW-015 steps will go here

    });

});