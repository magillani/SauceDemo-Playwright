import { test, expect } from '@playwright/test';

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


    test('PW-020 Verify adding one product to cart.', async ({ page }) => {

        // Get the first product
        const product = page.locator('[data-test="inventory-item"]').first();

        // NOW verify user is on the detail inventory page.
        await expect(page).toHaveURL(inventoryURL);

        // Get product details from the Inventory page
        const productName = product.locator('[data-test="inventory-item-name"]');
        const ProductNameText = await productName.innerText();
        const ProductDescription = product.locator('[data-test="inventory-item-desc"]');
        const ProductDescriptionText = await ProductDescription.innerText();
        const ProductPrice = product.locator('[data-test="inventory-item-price"]');
        const ProductPriceText = await ProductPrice.innerText();
        const ProductImage = product.getByRole('img', { name: 'Sauce Labs Backpack' });

        //Verify the product image is available
        await expect(ProductImage).toBeVisible();

        //Click the first product detail page
        await productName.first().click();

        // Verify product detail page is opened
        await expect(page).toHaveURL(/inventory-item/);

        // Verify product Name, Description and price is visible
        await expect(productName).toBeVisible();
        await expect(ProductDescription).toBeVisible();
        await expect(ProductPrice).toBeVisible();


        // Verify the 'Add to Cart' button is visibale
        const AddToCartBtn = page.getByRole('button', { name: 'Add to cart' });
        await expect(AddToCartBtn).toBeVisible();
        await expect(AddToCartBtn).toBeEnabled();
        await AddToCartBtn.click();

        // Verify once the product is added to the cart, The 'Add to Cart' shouldn't be visible
        await expect(AddToCartBtn).toBeHidden();


        //Verify Once Product is added to Card, A Remove button shoud be visible and clickable
        const removeBtn = page.getByRole('button', { name: 'Remove' });
        await expect(removeBtn).toHaveText('Remove');
        await expect(removeBtn).toBeVisible();
        await expect(removeBtn).toBeEnabled();


        // Verify the Once the product is added to the cart, The 'Add to Ccart' should preview as '1' in the cart.
        const cartIcon = page.locator('[data-test="shopping-cart-link"]');
        await expect(cartIcon).toBeVisible();
        await expect(cartIcon).toHaveText('1');

        // Open My Cart screen.
        await CartIcon.click();

        // Verify the Cart Page Opens successfully
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

        /* await expect(page.getByText('Your Cart')).toBeVisible(); */
        await expect(page.getByText('Your Cart', { exact: true })).toBeVisible();

        // Compare product details between Detail page and Cart
        const CartProductName = await page.getByText('Sauce Labs Backpack').innerText();
        const CartProdctDescription = await page.locator('[data-test="inventory-item-desc"]').innerText();
        const CartProductPrice = await page.locator('[data-test="inventory-item-price"]').innerText();

        expect(ProductNameText).toBe(CartProductName);
        expect(ProductDescriptionText).toBe(CartProdctDescription);
        expect(ProductPriceText).toBe(CartProductPrice);

    });

    test('PW-021 Verify Add all available products to cart.', async ({ page }) => {


        // NOW verify user is on the detail inventory page.
        await expect(page).toHaveURL(inventoryURL);

        const products = page.locator('[data-test="inventory-item"]');

        const productsToAdd = 3;

        for (const product of (await products.all()).slice(0, 3)) {
            await expect(product).toBeVisible();
            const addToCartBtn = product.getByRole('button', { name: 'Add to cart' });
            await expect(addToCartBtn).toBeVisible();
            await addToCartBtn.click();
        }

        const cartIcon = page.locator('[data-test="shopping-cart-link"]');


        // Verify cart badge shows 3
        await expect(cartIcon).toHaveText(productsToAdd.toString());

        // Open My Cart screen.
        await cartIcon.click();

        // Verify the Cart Page Opens successfully
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

        // Verify all products are present in Cart
        const cartProducts = page.locator('[data-test="inventory-item"]');


        const firstProduct = await page.locator('[data-test="inventory-item-name"]').nth(0).innerText();
        const secondProduct = await page.locator('[data-test="inventory-item-name"]').nth(1).innerText();
        const thirdProduct = await page.locator('[data-test="inventory-item-name"]').nth(2).innerText();

        await expect(cartProducts).toHaveCount(3);

        console.log('Products added to cart: 3');

        console.log(firstProduct, '\n', secondProduct, '\n', thirdProduct)


    });

    test('PW-022 Verify to Add all available products to cart.', async ({ page }) => {


        // NOW verify user is on the detail inventory page.
        await expect(page).toHaveURL(inventoryURL);

        const products = page.locator('[data-test="inventory-item"]');

        const counts = await products.count();
        console.log('The Total products are: ', counts);

        for (const product of await products.all()) {
            await expect(product).toBeVisible();
            const addToCartBtn = product.getByRole('button', { name: 'Add to cart' });
            await expect(addToCartBtn).toBeVisible();
            await addToCartBtn.click();
        }

        const cartIcon = page.locator('[data-test="shopping-cart-link"]');

        await expect(cartIcon).toBeVisible();
        await expect(cartIcon).toHaveText(counts.toString());

        // Open My Cart screen.
        await cartIcon.click();

        // Verify the Cart Page Opens successfully
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

        // Verify all products are present in Cart
        const cartProducts = page.locator('[data-test="inventory-item"]');
        await expect(cartProducts).toHaveCount(counts);
        console.log('Products added to cart:', counts);

    });

    test('PW-023 Verify to Remove a product from inventory page.', async ({ page }) => {

        // NOW verify user is on the detail inventory page.
        await expect(page).toHaveURL(inventoryURL);

        // Get the first product
        const product = page.locator('[data-test="inventory-item"]').first();

        //Click the first product detail page
        const productName = page.locator('[data-test="inventory-item-name"]');
        await productName.first().click();


        // Verify product detail page is opened
        await expect(page).toHaveURL(/inventory-item/);

        // Verify the 'Add to Cart' button is visibale
        const addToCartBtn = page.getByRole('button', { name: 'Add to cart' });
        await expect(addToCartBtn).toBeVisible();
        await addToCartBtn.click();

        //Verify Once Product is added to Card, A Remove button shoud be visible and clickable
        const removeBtn = page.getByRole('button', { name: 'Remove' });
        await expect(removeBtn).toHaveText('Remove');
        await expect(removeBtn).toBeVisible();
        await expect(removeBtn).toBeEnabled();
        await removeBtn.click();

        const cartIcon = page.locator('[data-test="shopping-cart-link"]');
        await expect(cartIcon).toHaveText('');

        // Open My Cart screen.
        await cartIcon.click();


        // Verify the Cart Page Opens successfully
        await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

        /* await expect(page.getByText('Your Cart')).toBeVisible(); */
        await expect(page.getByText('Your Cart', { exact: true })).toBeVisible();

        //Verify no product in the cart, once removed
        const cartProducts = page.locator('[data-test="inventory-item"]');

        await expect(cartProducts).toHaveCount(0);

    });

    test('PW-024 Sort products A to Z. ', async ({ page }) => {

        // NOW verify user is on the detail inventory page.
        await expect(page).toHaveURL(inventoryURL);

        //Click the sort dropdown
        const sortByAZ = await page.locator('[data-test="product-sort-container"]').selectOption('az');

        // This is product locator
        const products = page.locator('[data-test="inventory-item-name"]');

        //Now Get product names using the locator, here gets the names from the page:
        const productNames = await products.allInnerTexts();

        // Now we are sorting products, which we got from page
        const expectedNames = [...productNames].sort();


        //  // Verify products are sorted A to Z
        expect(productNames).toEqual(expectedNames);

        console.log('Products are sorted as A to Z: ', productNames)

    });


});







//==============================
// Negative Inventory Scenarios
// ==============================