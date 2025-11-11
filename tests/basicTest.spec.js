
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


//DAY 6

test("Mouse actions", async ({ page }) => {
  //we can select usign both getbyrole and locator
  await page.goto("https://demoqa.com/buttons");
  const doubleClickbtn = page.getByRole("button", { name: /Double Click Me/i });
  const rightClickbtn = page.getByRole("button", { name: /Right Click Me/i });

  const clickbtn = page.locator("text=Click Me").nth(2);

  await doubleClickbtn.dblclick();
  await expect(page.locator("#doubleClickMessage")).toBeVisible();

  await rightClickbtn.click({ button: "right" });
  await expect(page.locator("#rightClickMessage")).toBeVisible();

  await clickbtn.click();
  await expect(page.locator("#dynamicClickMessage")).toBeVisible();
});

test("Hover actions", async ({ page }) => {
  await page.goto("https://demoqa.com/tool-tips");
  await page.getByRole("button", { name: "Hover me to see" }).hover();

  //// Wait for tooltip to be attached to the DOM (needed for github actions)
  await page.waitForSelector(".tooltip-inner", { timeout: 20000 });
  await expect(page.locator(".tooltip-inner")).toBeVisible();
});

test("Keyboard actions", async ({ page }) => {
  await page.goto("https://demoqa.com/automation-practice-form");
  const firstName = page.locator("#firstName");
  await firstName.click();
  await page.keyboard.type("Robo");
  await page.keyboard.press("Tab");
  await page.keyboard.type("Man");

  await page.keyboard.press("Enter");
});

test("Drop-down actions", async ({ page }) => {
  await page.goto("https://demoqa.com/select-menu");

  //by INDEX
  const selectOne = page.locator("#selectOne");
  await selectOne.click();
  const options = page.locator("div[id^='react-select-3-option']");
  await options.nth(1).click();

  //selectOption only works with <select> html tag
  // await selectOne.selectOption({ index: 2 });

  //toBe works with exact match
  //therefore we use toContainText, since we get a long text
  await expect(selectOne).toContainText(/Mr/i);

  //BY VALUE
  const cars = page.locator("#cars");
  await cars.selectOption([{ value: "volvo" }, { value: "saab" }]);

  //select.selectedOptions gives all the selected options

  //<select id="cars" multiple>
  //     <option value="volvo">Volvo</option>
  //     <option value="saab">Saab</option>
  //     <option value="opel">Opel</option>
  // </select>
  const selectedCards = await cars.evaluate((select) =>
    Array.from(select.selectedOptions).map((option) => option.value)
  );

  expect(selectedCards).toEqual(["volvo", "saab"]);

  //BY VISIBLE TEXT
  const oldSelectMenu = page.locator("#oldSelectMenu");
  await oldSelectMenu.selectOption({ label: "Purple" });
  await expect(oldSelectMenu).toContainText(/Purple/i);
});