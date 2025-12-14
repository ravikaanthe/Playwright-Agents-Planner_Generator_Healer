# SauceDemo E-Commerce Application Test Plan

## Application Overview

SauceDemo is an e-commerce web application designed for testing automation practices. It simulates an online store selling Sauce Labs merchandise including backpacks, clothing, and accessories. The application includes login functionality with multiple test user accounts, product catalog browsing, shopping cart management, checkout process, and order completion. The application also includes specific test scenarios with different user types that exhibit various behaviors and issues, making it ideal for comprehensive testing coverage.

## Test Scenarios

### 1. Authentication and User Management

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful Login with Valid Credentials

**File:** `tests/authentication/successful-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'standard_user' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the Login button

**Expected Results:**
  - User is redirected to the inventory page (/inventory.html)
  - Products page displays with 'Products' heading
  - All 6 products are visible on the page
  - User menu is accessible via hamburger menu

#### 1.2. Login with Locked Out User

**File:** `tests/authentication/locked-out-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'locked_out_user' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the Login button

**Expected Results:**
  - Error message appears stating 'Sorry, this user has been locked out.'
  - User remains on the login page
  - Login form is still visible
  - No redirection occurs

#### 1.3. Login with Problem User

**File:** `tests/authentication/problem-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'problem_user' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the Login button

**Expected Results:**
  - User is redirected to the inventory page
  - Products page may display with visual issues or broken images
  - Application functionality may be impaired
  - User can still access the menu and navigate

#### 1.4. Login with Performance Glitch User

**File:** `tests/authentication/performance-glitch-user-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'performance_glitch_user' in the username field
  3. Enter 'secret_sauce' in the password field
  4. Click the Login button

**Expected Results:**
  - Login process takes significantly longer than normal
  - User is eventually redirected to the inventory page
  - Application may load slowly throughout the session
  - All functionality remains available but with delays

#### 1.5. Login with Invalid Credentials

**File:** `tests/authentication/invalid-credentials-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Enter 'invalid_user' in the username field
  3. Enter 'wrong_password' in the password field
  4. Click the Login button

**Expected Results:**
  - Error message appears stating username and password do not match
  - User remains on the login page
  - Login form is still visible and editable
  - No redirection occurs

#### 1.6. Login with Empty Credentials

**File:** `tests/authentication/empty-credentials-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Leave username field empty
  3. Leave password field empty
  4. Click the Login button

**Expected Results:**
  - Error message appears indicating username is required
  - User remains on the login page
  - Form validation prevents submission
  - No redirection occurs

#### 1.7. Successful Logout

**File:** `tests/authentication/successful-logout.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Navigate to the inventory page
  3. Click the hamburger menu button
  4. Click the 'Logout' link in the menu

**Expected Results:**
  - User is redirected to the login page
  - Username and password fields are empty
  - All session data is cleared
  - Navigation menu is no longer accessible

### 2. Product Catalog and Browsing

**Seed:** `tests/seed.spec.ts`

#### 2.1. Product Catalog Display Verification

**File:** `tests/product-catalog/product-display-verification.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Verify all products are displayed on the inventory page

**Expected Results:**
  - 6 products are displayed: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt (Red)
  - Each product displays: image, name, description, price, and 'Add to cart' button
  - Product prices are: Backpack ($29.99), Bike Light ($9.99), Bolt T-Shirt ($15.99), Fleece Jacket ($49.99), Onesie ($7.99), Red T-Shirt ($15.99)
  - All product images load correctly

#### 2.2. Product Sorting by Name A to Z

**File:** `tests/product-catalog/sorting-name-a-to-z.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Select 'Name (A to Z)' from the sort dropdown

**Expected Results:**
  - Products are sorted alphabetically: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt (Red)
  - Sort dropdown displays 'Name (A to Z)' as selected
  - All products remain visible
  - Product information remains accurate

#### 2.3. Product Sorting by Name Z to A

**File:** `tests/product-catalog/sorting-name-z-to-a.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Select 'Name (Z to A)' from the sort dropdown

**Expected Results:**
  - Products are sorted reverse alphabetically: Test.allTheThings() T-Shirt (Red), Sauce Labs Onesie, Sauce Labs Fleece Jacket, Sauce Labs Bolt T-Shirt, Sauce Labs Bike Light, Sauce Labs Backpack
  - Sort dropdown displays 'Name (Z to A)' as selected
  - All products remain visible
  - Product information remains accurate

#### 2.4. Product Sorting by Price Low to High

**File:** `tests/product-catalog/sorting-price-low-to-high.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Select 'Price (low to high)' from the sort dropdown

**Expected Results:**
  - Products are sorted by price ascending: Onesie ($7.99), Bike Light ($9.99), Bolt T-Shirt ($15.99), Red T-Shirt ($15.99), Backpack ($29.99), Fleece Jacket ($49.99)
  - Sort dropdown displays 'Price (low to high)' as selected
  - All products remain visible
  - Price order is mathematically correct

#### 2.5. Product Sorting by Price High to Low

**File:** `tests/product-catalog/sorting-price-high-to-low.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Select 'Price (high to low)' from the sort dropdown

**Expected Results:**
  - Products are sorted by price descending: Fleece Jacket ($49.99), Backpack ($29.99), Bolt T-Shirt ($15.99), Red T-Shirt ($15.99), Bike Light ($9.99), Onesie ($7.99)
  - Sort dropdown displays 'Price (high to low)' as selected
  - All products remain visible
  - Price order is mathematically correct

#### 2.6. Individual Product Detail Page Access

**File:** `tests/product-catalog/product-detail-page-access.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Click on the 'Sauce Labs Backpack' product name link
  3. Verify product detail page content
  4. Click 'Back to products' button

**Expected Results:**
  - User is redirected to product detail page (/inventory-item.html?id=4)
  - Large product image is displayed
  - Product name, description, and price are shown
  - 'Add to cart' button is present
  - 'Back to products' button returns to inventory page

#### 2.7. Product Image Link Navigation

**File:** `tests/product-catalog/product-image-link-navigation.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Click on the product image for 'Sauce Labs Bike Light'
  3. Verify product detail page loads
  4. Navigate back to products page

**Expected Results:**
  - Product detail page loads correctly
  - Correct product information is displayed
  - Product image is enlarged
  - Navigation functions properly

### 3. Shopping Cart Functionality

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add Single Item to Cart

**File:** `tests/shopping-cart/add-single-item-to-cart.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Click 'Add to cart' button for 'Sauce Labs Backpack'
  3. Verify cart icon updates
  4. Verify button text changes

**Expected Results:**
  - Cart icon displays '1' indicating one item
  - 'Add to cart' button changes to 'Remove' button
  - Product remains visible on the page
  - No page refresh or redirection occurs

#### 3.2. Add Multiple Items to Cart

**File:** `tests/shopping-cart/add-multiple-items-to-cart.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Click 'Add to cart' for 'Sauce Labs Backpack'
  3. Click 'Add to cart' for 'Sauce Labs Bike Light'
  4. Click 'Add to cart' for 'Sauce Labs Bolt T-Shirt'
  5. Verify cart count updates

**Expected Results:**
  - Cart icon displays '3' indicating three items
  - All three 'Add to cart' buttons change to 'Remove' buttons
  - Cart count increments with each addition
  - No performance issues occur

#### 3.3. Remove Item from Cart via Product Page

**File:** `tests/shopping-cart/remove-item-from-product-page.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add 'Sauce Labs Backpack' to cart
  3. Click the 'Remove' button for the backpack
  4. Verify cart updates

**Expected Results:**
  - Cart icon count decreases or disappears if empty
  - 'Remove' button changes back to 'Add to cart'
  - Item is no longer in the cart
  - Cart functionality remains intact

#### 3.4. View Cart Contents

**File:** `tests/shopping-cart/view-cart-contents.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add 'Sauce Labs Backpack' and 'Sauce Labs Bike Light' to cart
  3. Click on the cart icon
  4. Verify cart page content

**Expected Results:**
  - User is redirected to cart page (/cart.html)
  - Cart displays 'Your Cart' heading
  - Both products are listed with quantity, description, and price
  - QTY column shows '1' for each item
  - 'Continue Shopping' and 'Checkout' buttons are present

#### 3.5. Remove Item from Cart Page

**File:** `tests/shopping-cart/remove-item-from-cart-page.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add items to cart and navigate to cart page
  3. Click 'Remove' button next to an item
  4. Verify item removal

**Expected Results:**
  - Item is removed from cart page
  - Cart count decreases
  - Other items remain in cart
  - Page updates without refresh

#### 3.6. Continue Shopping from Cart

**File:** `tests/shopping-cart/continue-shopping-from-cart.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add items to cart and navigate to cart page
  3. Click 'Continue Shopping' button

**Expected Results:**
  - User returns to inventory page (/inventory.html)
  - Cart contents are preserved
  - Cart count remains unchanged
  - All products are still visible

#### 3.7. Empty Cart Behavior

**File:** `tests/shopping-cart/empty-cart-behavior.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Navigate to cart page without adding items
  3. Verify empty cart display

**Expected Results:**
  - Cart page displays with no items
  - Cart icon shows no count or shows '0'
  - Continue Shopping and Checkout buttons are present
  - No error messages appear

### 4. Checkout Process

**Seed:** `tests/seed.spec.ts`

#### 4.1. Complete Checkout Process with Valid Information

**File:** `tests/checkout/complete-checkout-valid-info.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add 'Sauce Labs Backpack' to cart
  3. Navigate to cart and click 'Checkout'
  4. Fill in First Name: 'John', Last Name: 'Doe', Zip: '12345'
  5. Click 'Continue' button
  6. Review order summary and click 'Finish'
  7. Verify order completion

**Expected Results:**
  - User progresses through checkout-step-one.html
  - Order summary page (checkout-step-two.html) displays correctly
  - Payment info shows 'SauceCard #31337'
  - Shipping shows 'Free Pony Express Delivery!'
  - Price breakdown shows item total, tax, and final total
  - Order completion page displays 'Thank you for your order!' message
  - Cart is cleared after order completion

#### 4.2. Checkout with Multiple Items

**File:** `tests/checkout/checkout-multiple-items.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add multiple items to cart (Backpack, Bike Light, T-Shirt)
  3. Proceed through complete checkout process

**Expected Results:**
  - All items appear in checkout overview
  - Total price calculation is correct
  - Tax calculation is accurate
  - Order completion succeeds for multiple items

#### 4.3. Checkout Form Validation - Missing First Name

**File:** `tests/checkout/checkout-validation-missing-first-name.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add item to cart and proceed to checkout
  3. Leave First Name field empty
  4. Fill Last Name and Zip Code
  5. Click 'Continue' button

**Expected Results:**
  - Error message appears indicating First Name is required
  - User remains on checkout-step-one.html page
  - Form does not proceed to next step
  - Other field values are preserved

#### 4.4. Checkout Form Validation - Missing Last Name

**File:** `tests/checkout/checkout-validation-missing-last-name.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add item to cart and proceed to checkout
  3. Fill First Name and Zip Code
  4. Leave Last Name field empty
  5. Click 'Continue' button

**Expected Results:**
  - Error message appears indicating Last Name is required
  - User remains on checkout form
  - Validation prevents progression
  - Field values are maintained

#### 4.5. Checkout Form Validation - Missing Postal Code

**File:** `tests/checkout/checkout-validation-missing-postal-code.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add item to cart and proceed to checkout
  3. Fill First Name and Last Name
  4. Leave Zip/Postal Code field empty
  5. Click 'Continue' button

**Expected Results:**
  - Error message appears indicating Postal Code is required
  - User remains on checkout form
  - Form validation works correctly
  - No progression to overview page

#### 4.6. Cancel Checkout from Information Page

**File:** `tests/checkout/cancel-checkout-info-page.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add items to cart and proceed to checkout
  3. Click 'Cancel' button on checkout information page

**Expected Results:**
  - User returns to cart page
  - Cart contents are preserved
  - No checkout information is saved
  - Cart functionality remains intact

#### 4.7. Cancel Checkout from Overview Page

**File:** `tests/checkout/cancel-checkout-overview-page.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Complete checkout information form
  3. On checkout overview page, click 'Cancel' button

**Expected Results:**
  - User returns to cart page
  - Cart items remain unchanged
  - No order is processed
  - Checkout can be restarted

#### 4.8. Return Home from Order Completion

**File:** `tests/checkout/return-home-order-completion.spec.ts`

**Steps:**
  1. Complete full checkout process
  2. On order completion page, click 'Back Home' button

**Expected Results:**
  - User returns to inventory page
  - Cart is empty
  - All products are available for new orders
  - Application state is reset for new session

### 5. Navigation and User Interface

**Seed:** `tests/seed.spec.ts`

#### 5.1. Navigation Menu Accessibility

**File:** `tests/navigation/menu-accessibility.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Click the hamburger menu button
  3. Verify menu options are displayed
  4. Click 'Close Menu' button

**Expected Results:**
  - Menu slides out showing: All Items, About, Logout, Reset App State
  - All menu items are clickable
  - Close button properly closes menu
  - Menu functionality is smooth and responsive

#### 5.2. All Items Menu Link

**File:** `tests/navigation/all-items-menu-link.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Navigate to cart page
  3. Open hamburger menu and click 'All Items'

**Expected Results:**
  - User is redirected to inventory page
  - 'All Items' link functions from any page
  - Product catalog is displayed correctly
  - Menu closes after selection

#### 5.3. About Menu Link

**File:** `tests/navigation/about-menu-link.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Open hamburger menu
  3. Click 'About' link

**Expected Results:**
  - User is redirected to https://saucelabs.com/ in new tab/window
  - Original SauceDemo session remains active
  - External link functions correctly
  - No loss of cart contents

#### 5.4. Reset App State Functionality

**File:** `tests/navigation/reset-app-state.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Add multiple items to cart
  3. Open hamburger menu and click 'Reset App State'
  4. Verify application state reset

**Expected Results:**
  - Cart is cleared of all items
  - Cart count resets to empty
  - All 'Remove' buttons change back to 'Add to cart'
  - Application returns to initial logged-in state

#### 5.5. Social Media Links in Footer

**File:** `tests/navigation/social-media-links.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Scroll to footer section
  3. Click on Twitter, Facebook, and LinkedIn links

**Expected Results:**
  - Twitter link opens https://twitter.com/saucelabs
  - Facebook link opens https://www.facebook.com/saucelabs
  - LinkedIn link opens https://www.linkedin.com/company/sauce-labs/
  - Links open in appropriate target (new tab/window)

#### 5.6. Page Title and Header Consistency

**File:** `tests/navigation/page-title-header-consistency.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Navigate through different pages (inventory, cart, checkout)
  3. Verify page titles and headers

**Expected Results:**
  - All pages show 'Swag Labs' title
  - Page headers update appropriately (Products, Your Cart, Checkout)
  - Branding remains consistent across pages
  - Navigation elements are always accessible

### 6. Error Handling and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 6.1. Direct URL Access Without Authentication

**File:** `tests/error-handling/direct-url-access-no-auth.spec.ts`

**Steps:**
  1. Navigate directly to https://www.saucedemo.com/inventory.html without logging in

**Expected Results:**
  - User is redirected to login page
  - No inventory content is accessible
  - Proper authentication enforcement
  - No error messages in console

#### 6.2. Browser Back Button Behavior

**File:** `tests/error-handling/browser-back-button-behavior.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Navigate to product detail page
  3. Use browser back button
  4. Navigate to cart page and use back button

**Expected Results:**
  - Back navigation works correctly
  - Session state is maintained
  - Cart contents are preserved
  - No broken page states occur

#### 6.3. Session Timeout Handling

**File:** `tests/error-handling/session-timeout-handling.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Wait for extended period of inactivity
  3. Attempt to perform actions

**Expected Results:**
  - Session handling is graceful
  - User is redirected to login if session expires
  - No data corruption occurs
  - Clear indication of session status

#### 6.4. Multiple Tab Session Management

**File:** `tests/error-handling/multiple-tab-session-management.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials in first tab
  2. Open second tab and navigate to application
  3. Perform actions in both tabs
  4. Log out from one tab

**Expected Results:**
  - Session behavior is consistent across tabs
  - Cart state synchronization (if applicable)
  - Logout affects all tabs appropriately
  - No session conflicts occur

#### 6.5. Network Error Handling

**File:** `tests/error-handling/network-error-handling.spec.ts`

**Steps:**
  1. Log in with 'standard_user' credentials
  2. Simulate network disconnection
  3. Attempt to perform actions
  4. Restore network connection

**Expected Results:**
  - Application handles network errors gracefully
  - Appropriate error messages are displayed
  - Application recovers when connection restored
  - User data is preserved where possible

### 7. Special User Scenarios

**Seed:** `tests/seed.spec.ts`

#### 7.1. Visual User Experience Testing

**File:** `tests/special-users/visual-user-experience.spec.ts`

**Steps:**
  1. Log in with 'visual_user' credentials
  2. Navigate through all pages
  3. Perform standard shopping flow
  4. Compare visual elements with standard user

**Expected Results:**
  - Visual differences may be present for testing purposes
  - Core functionality remains intact
  - No functional blocking issues occur
  - Visual regression can be documented

#### 7.2. Error User Behavior Testing

**File:** `tests/special-users/error-user-behavior.spec.ts`

**Steps:**
  1. Log in with 'error_user' credentials
  2. Attempt to add items to cart
  3. Try to proceed through checkout
  4. Document any error behaviors

**Expected Results:**
  - Specific error conditions may be triggered
  - Error behaviors are consistent and predictable
  - Application doesn't crash or become unresponsive
  - Error states can be recovered from

#### 7.3. Performance Glitch User Load Testing

**File:** `tests/special-users/performance-glitch-load-testing.spec.ts`

**Steps:**
  1. Log in with 'performance_glitch_user' credentials
  2. Measure page load times
  3. Complete full shopping workflow
  4. Monitor response times for each action

**Expected Results:**
  - Performance delays are measurable and consistent
  - All functionality eventually completes
  - No timeouts or failures occur due to delays
  - Performance impact is isolated to this user type
