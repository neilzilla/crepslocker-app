/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const deliveryGroupId = input.cart.deliveryGroups[0].id;
  const costsArray = input.cart.deliveryGroups[0].deliveryOptions.map((option) => option.cost.amount);
  const allCostsEndIn98 = costsArray.every((cost) => cost.toString().endsWith('98'));
  return allCostsEndIn98 ? {
    discounts: [
      {
        message: `Shipping Discount`,
        value: {
          percentage: {
            value: 50
          }
        },
        targets: [
          {
            deliveryGroup: {
              id: deliveryGroupId
            }
          }
        ]
      }
    ],
  } : 
  {
    discounts: [
    ],
  }
};