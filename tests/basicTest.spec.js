
const { test, expect } = require("@playwright/test");

test("Verify Playwright Navbar (Assignment 1)", async ({ page }) => {
 
  await page.goto("https://playwright.dev/docs/intro");

  //title check
  await expect(page).toHaveTitle(/Playwright/);
  await expect(page).toHaveURL("https://playwright.dev/docs/intro");

  //navbar checks
  await expect(
    page.locator('nav[aria-label="Main"] >> text=Docs')
  ).toBeVisible();
  await expect(
    page.locator('nav[aria-label="Main"] >> text=API')
  ).toBeVisible();
  await expect(
    page.locator('nav[aria-label="Main"] >> text=Community')
  ).toBeVisible();

 
  await page.close();
});

const login = async(page) => {
  await page.goto("https://www.saucedemo.com/");
  const logo = page.getByText("Swag Labs");
  
  const username = page.getByPlaceholder("Username");
  await username.fill("standard_user");


  const password = page.getByPlaceholder("Password");
  await password.fill("secret_sauce");

  
  const loginBtn = page.getByRole("button", { name: "Login" });
  await loginBtn.click();
}


test("Verify login page and authentication of swagLabs", async ({ page }) => {
  await login(page);
  //check if login is successful
  await expect(page).toHaveURL(/inventory.html/);

  await page.close();
});



test("Inventory Page Check After login in swaglabs", async ({ page }) => {
 await login(page)

  await expect(page).toHaveTitle("Swag Labs");

  
  const logo = page.getByText("Swag Labs");
  await expect(logo).toBeVisible();

  // /i makes it case sensitive
  //since there are chances of multiple buttons with same name, we use first()
  const addToCartBtn = page
    .getByRole("button", { name: /Add to cart/i }).first()
   
  await expect(addToCartBtn).toBeEnabled();

  //side menu working
  await page.getByRole("button", { name: /open menu/i }).click();

 
  await page.getByRole("button", { name: /close menu/i }).click();


});



test("DemoQA Form filling", async({page}) => {
  let testData = {
    name: "Robot",
    email: "robo@gmail.com",
    currentAddress: "Mars",
    permanentAddress: "Jupiter",
  };

  await page.goto("https://demoqa.com/text-box");

  //selecting input fields using id

  await page.locator("#userName").fill(testData.name);
  await page.locator("#userEmail").fill(testData.email);
  await page.locator("#currentAddress").fill(testData.currentAddress);
  await page.locator("#permanentAddress").fill(testData.permanentAddress);
  await page.locator("#submit").click();

  await expect(page.locator("#output")).toBeVisible();

  await expect(page.locator("#name")).toContainText(testData.name);
  await expect(page.locator("#email")).toContainText(testData.email);

  //spaces and colon are making toContainText to fail, so therefore using hasText with regex
  await expect(
    page.locator("#currentAddress", { hasText: /Mars/i })
  ).toBeVisible();
  await expect(
    page.locator("#permanentAddress", { hasText: /Jupiter/i })
  ).toBeVisible();
})


test("DemoQA Checkboxes", async({page}) => {
  await page.goto("https://demoqa.com/radio-button");


  //radiobuttons are hidden, so cant select using id. 
  //best practice is to use label text for seclecting its respective radio button
  const yesRadio = page.locator('label[for="yesRadio"]');
  await yesRadio.click();
  await expect(yesRadio).toBeChecked();
  
  await expect(page.locator(".text-success")).toBeVisible();
  await expect(page.locator(".text-success")).toHaveText("Yes");

})

test("DemoQA File Checkbox", async({page}) => {
  await page.goto("https://demoqa.com/checkbox");
  
  await page.locator('button[aria-label="Toggle"]').click();
  
  const desktopCheckbox = page.locator('label[for="tree-node-desktop"]');
  await desktopCheckbox.click();
  await expect(desktopCheckbox).toBeChecked();
  
  const result = page.locator("#result");
  await expect(result).toBeVisible();
  await expect(result).toHaveText(/desktop/i);
  

})