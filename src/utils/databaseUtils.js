import { db } from "../config/fireBaseConfig";

export const getProductDataSet = () => {
  let result = {
    data: [],
    isLoading: true
  };
  console.log("get data");
  try {
    let productsRef = db.ref("/products");
    productsRef.on("value", snapshot => {
      snapshot.forEach(child => {
        result.data.push({
          name: child.val().name,
          color: child.val().color,
          producer: child.val().producer,
          price: Number(child.val().price),
          amount: Number(child.val().amount),
          id: child.key
        });
      });
      result.isLoading = false;
      console.log(result);
      return result;
    });
  } catch (e) {
    console.log(e);
  }
};
