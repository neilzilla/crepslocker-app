// @ts-check

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
* @typedef {import("../generated/api").Operation} Operation
*/

// The configured entrypoint for the 'purchase.delivery-customization.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {

  const items = input.cart.lines;

  // Check if any of the items have the `Express Shipping = False` metafield
  const hasSevenTwentyOne = items.find(item => item.merchandise.seven_twentyone?.value === 'true');
  const hasSevenFourteen = items.find(item => item.merchandise.seven_fourteen?.value === 'true');
  const hasNoExpressShipping = items.find(item => !(!!(item.merchandise.express_shipping)) || item.merchandise.express_shipping?.value === 'false')
  const allExpressShipping = items.every(item => item.merchandise.express_shipping?.value === 'true')

  const deliveryGroups = input.cart.deliveryGroups[0].deliveryOptions;
  const hasThreeFive = deliveryGroups.find(group => group.title === 'Standard Delivery (3-5 Working Days)');
  const basicStandardDelivery = hasThreeFive ? 'Standard Delivery (3-5 Working Days)' : 'Standard Delivery (2-7 Working Days)';
  const operations = []

  if (hasSevenTwentyOne) {
    const groupsToHide = deliveryGroups.filter(group => group.title != 'Standard Delivery (7-21 Working Days)');
    for (const group of groupsToHide) {
      operations.push({
        "hide": {
          "deliveryOptionHandle": group.handle
        }
      })
    }
  }
  else if (hasSevenFourteen) {
    const groupsToHide = deliveryGroups.filter(group => group.title != 'Standard Delivery (7-14 Working Days)');
    for (const group of groupsToHide) {
      operations.push({
        "hide": {
          "deliveryOptionHandle": group.handle
        }
      })
    }
  }
  else if (hasNoExpressShipping) {
    const groupsToHide = deliveryGroups.filter(group => group.title != 'Standard Delivery (2-7 Working Days)');
    for (const group of groupsToHide) {
      operations.push({
        "hide": {
          "deliveryOptionHandle": group.handle
        }
      })
    }
  }
  else if (allExpressShipping) {
    const groupsToHide = deliveryGroups.filter(group => group.title != 'Express (1-3 Working Days)' && group.title != basicStandardDelivery && group.title != 'Express (2-5 Working Days)');
    for (const group of groupsToHide) {
      operations.push({
        "hide": {
          "deliveryOptionHandle": group.handle
        }
      })
    }
  }
  else {
    return {
      operations: []
    }
  }

  return {
    operations
  };
  
};
