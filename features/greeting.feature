Feature: Login and Order Placement

Scenario Outline: User can add product to cart and place order successfully

  Given User login to the system successfully with username "<username>" and password "<password>"
  When User add the product "<product name>" to the cart
  Then User verify the product "<product name>" is added to the cart successfully
  When User proceed to checkout and place the order
  Then User verify the order is displayed in the order history successfully

Examples:
  | username           | password    | product name |
  | anshika@gmail.com  | Iamking@000 | ZARA COAT 3  |
