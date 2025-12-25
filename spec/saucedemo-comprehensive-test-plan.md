# SauceDemo Comprehensive Test Plan

## Application Overview

This test plan covers the core features and business rules of the SauceDemo e-commerce application, as specified in the requirements. It includes user authentication, product catalog, shopping cart, checkout process, navigation, UI, and business rule validation. The plan ensures coverage of both happy paths and edge cases, with clear steps and expected outcomes for each scenario.

## Test Scenarios

### 1. User Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Login with Valid Standard User

**File:** `tests/authentication/standard-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter username: standard_user
  3. Enter password: secret_sauce
  4. Click the Login button

**Expected Results:**
  - User is redirected to the inventory page
  - Inventory page is visible

#### 1.2. Login with Locked Out User

**File:** `tests/authentication/locked-out-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter username: locked_out_user
  3. Enter password: secret_sauce
  4. Click the Login button

**Expected Results:**
  - Error message is displayed indicating user is locked out
  - User remains on login page

#### 1.3. Login with Problem User

**File:** `tests/authentication/problem-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter username: problem_user
  3. Enter password: secret_sauce
  4. Click the Login button

**Expected Results:**
  - User is redirected to the inventory page (verify for any UI issues specific to problem_user)

#### 1.4. Login with Invalid Credentials

**File:** `tests/authentication/invalid-credentials-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter invalid username and/or password
  3. Click the Login button

**Expected Results:**
  - Error message is displayed
  - User remains on login page

#### 1.5. Logout Functionality

**File:** `tests/authentication/successful-logout.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Open main menu
  3. Click Logout

**Expected Results:**
  - User is redirected to login page

### 2. Product Catalog

**Seed:** `tests/seed.spec.ts`

#### 2.1. View All Products

**File:** `tests/product-catalog/product-display-verification.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Verify all products are displayed on inventory page

**Expected Results:**
  - All products are visible with name, price, description, and image

#### 2.2. Product Sorting - Name A-Z

**File:** `tests/product-catalog/sorting-name-a-to-z.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Sort products by Name (A to Z)

**Expected Results:**
  - Products are sorted alphabetically A-Z

#### 2.3. Product Sorting - Name Z-A

**File:** `tests/product-catalog/sorting-name-z-to-a.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Sort products by Name (Z to A)

**Expected Results:**
  - Products are sorted alphabetically Z-A

#### 2.4. Product Sorting - Price Low-High

**File:** `tests/product-catalog/sorting-price-low-to-high.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Sort products by Price (low to high)

**Expected Results:**
  - Products are sorted by price ascending

#### 2.5. Product Sorting - Price High-Low

**File:** `tests/product-catalog/sorting-price-high-to-low.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Sort products by Price (high to low)

**Expected Results:**
  - Products are sorted by price descending

#### 2.6. Product Detail Page Access

**File:** `tests/product-catalog/product-detail-page-access.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Click on a product name or image

**Expected Results:**
  - Product detail page is displayed with correct information

### 3. Shopping Cart

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add Single Item to Cart

**File:** `tests/shopping-cart/add-single-item-to-cart.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add a product to the cart from inventory page

**Expected Results:**
  - Cart badge updates to 1
  - Product is listed in cart

#### 3.2. Add Multiple Items to Cart

**File:** `tests/shopping-cart/add-multiple-items-to-cart.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add multiple products to the cart

**Expected Results:**
  - Cart badge updates to correct count
  - All selected products are listed in cart

#### 3.3. Remove Item from Cart Page

**File:** `tests/shopping-cart/remove-item-from-cart-page.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add a product to the cart
  3. Go to cart page
  4. Remove the product

**Expected Results:**
  - Product is removed from cart
  - Cart badge updates

#### 3.4. Remove Item from Product Page

**File:** `tests/shopping-cart/remove-item-from-product-page.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add a product to the cart
  3. Go to product detail page
  4. Remove the product

**Expected Results:**
  - Product is removed from cart
  - Cart badge updates

#### 3.5. View Cart Contents

**File:** `tests/shopping-cart/view-cart-contents.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add products to cart
  3. Go to cart page

**Expected Results:**
  - Cart page lists all added products with correct details

#### 3.6. Continue Shopping from Cart

**File:** `tests/shopping-cart/continue-shopping-from-cart.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Go to cart page
  3. Click Continue Shopping

**Expected Results:**
  - User is redirected to inventory page

#### 3.7. Empty Cart Behavior

**File:** `tests/shopping-cart/empty-cart-behavior.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Go to cart page with no items

**Expected Results:**
  - Cart page displays empty state message

### 4. Checkout Process

**Seed:** `tests/seed.spec.ts`

#### 4.1. Checkout with Valid Info

**File:** `tests/checkout/complete-checkout-valid-info.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add products to cart
  3. Go to cart page
  4. Click Checkout
  5. Enter valid first name, last name, postal code
  6. Continue to overview
  7. Finish checkout

**Expected Results:**
  - Order is completed successfully
  - Confirmation page is displayed

#### 4.2. Checkout Validation - Missing First Name

**File:** `tests/checkout/checkout-validation-missing-first-name.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add products to cart
  3. Go to cart page
  4. Click Checkout
  5. Leave first name blank
  6. Attempt to continue

**Expected Results:**
  - Error message for missing first name is displayed

#### 4.3. Checkout Validation - Missing Last Name

**File:** `tests/checkout/checkout-validation-missing-last-name.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add products to cart
  3. Go to cart page
  4. Click Checkout
  5. Leave last name blank
  6. Attempt to continue

**Expected Results:**
  - Error message for missing last name is displayed

#### 4.4. Checkout Validation - Missing Postal Code

**File:** `tests/checkout/checkout-validation-missing-postal-code.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add products to cart
  3. Go to cart page
  4. Click Checkout
  5. Leave postal code blank
  6. Attempt to continue

**Expected Results:**
  - Error message for missing postal code is displayed

#### 4.5. Cancel Checkout from Info Page

**File:** `tests/checkout/cancel-checkout-info-page.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add products to cart
  3. Go to cart page
  4. Click Checkout
  5. Click Cancel

**Expected Results:**
  - User is returned to cart page

#### 4.6. Cancel Checkout from Overview Page

**File:** `tests/checkout/cancel-checkout-overview-page.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add products to cart
  3. Go to cart page
  4. Click Checkout
  5. Enter valid info
  6. Continue to overview
  7. Click Cancel

**Expected Results:**
  - User is returned to inventory page

#### 4.7. Return Home After Order Completion

**File:** `tests/checkout/return-home-order-completion.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Complete a checkout
  3. Click Back Home

**Expected Results:**
  - User is redirected to inventory page

### 5. Navigation & UI

**Seed:** `tests/seed.spec.ts`

#### 5.1. Main Menu Navigation

**File:** `tests/navigation/menu-accessibility.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Open main menu
  3. Navigate to all available menu links

**Expected Results:**
  - Each menu link navigates to correct page

#### 5.2. Cart Badge Counter Updates

**File:** `tests/shopping-cart/add-single-item-to-cart.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add and remove items from cart

**Expected Results:**
  - Cart badge updates correctly with each action

#### 5.3. Responsive Layout

**File:** `tests/navigation/page-title-header-consistency.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Resize browser window to various sizes

**Expected Results:**
  - Layout adapts correctly for all tested screen sizes

#### 5.4. Error Handling for Invalid Actions

**File:** `tests/error-handling/network-error-handling.spec.ts`

**Steps:**
  1. Simulate network error or invalid action

**Expected Results:**
  - Appropriate error message is displayed

### 6. Business Rules Validation

**Seed:** `tests/seed.spec.ts`

#### 6.1. Cart Persists During Session

**File:** `tests/shopping-cart/view-cart-contents.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add products to cart
  3. Refresh or navigate within session

**Expected Results:**
  - Cart contents persist until logout or session end

#### 6.2. Only Authenticated Users Can Access Inventory and Cart

**File:** `tests/error-handling/direct-url-access-no-auth.spec.ts`

**Steps:**
  1. Attempt to access inventory or cart page without logging in

**Expected Results:**
  - User is redirected to login page

#### 6.3. Product Quantity Limit in Cart

**File:** `tests/shopping-cart/add-single-item-to-cart.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Attempt to add same product to cart multiple times

**Expected Results:**
  - Only one instance of product is in cart

#### 6.4. Tax Calculation on Order Summary

**File:** `tests/checkout/complete-checkout-valid-info.spec.ts`

**Steps:**
  1. Login as standard_user
  2. Add products to cart
  3. Proceed to checkout overview

**Expected Results:**
  - Tax is calculated at 8% and displayed correctly
