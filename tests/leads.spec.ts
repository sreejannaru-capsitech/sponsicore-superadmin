import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("main page", () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto("https://sponsicore-website.capsitech.it/");
  });

  test("Create Lead", async ({ page }) => {
    page
      .locator(
        "//div[@class='relative bottom-[2px]']//div[@class='bg-[#01B075] cursor-pointer relative z-10 py-2 px-5 active:translate-y-1 focus:outline-none hover:bg-[#019E69] transition-transform duration-200 text-white text-base flex items-center justify-center text-center mx-auto rounded-lg'][normalize-space()='Get Started']"
      )
      .click();

    const firstName = faker.person.firstName();

    await page.getByLabel("Company Name").fill(faker.company.name());
    await page
      .getByLabel("Your Name")
      .fill(firstName + " " + faker.person.lastName());
    await page
      .getByLabel("Email Address")
      .fill(`${firstName}.manager@chitthi.in`);
    await page
      .locator("//input[@placeholder='Enter phone no.']")
      .fill(faker.phone.number());

    await page.locator("//div[@class='recaptcha-checkbox-checkmark']").click();
    await page.getByRole("button", { name: "Submit" }).click();
  });
});
