import { db } from "../config/fireBaseConfig";

export const getProductDataSet = async() => {
  let result = {
    data: [],
    isLoading: true
  };
  console.log("get product data");
  try {
    const ref = db.ref("/products");
    const snapshot = await ref.once('value');
      console.log(snapshot);
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

   
  } catch (e) {
    console.log(e);
  }
};

export const getOrderDataSet = async() => {
  let result = {
    data: [],
    isLoading: true
  };
  console.log("get order data");
  try {
    const ref = db.ref("/orders");
    const snapshot = await ref.once('value');
    console.log(snapshot);
      snapshot.forEach(child => {
        result.data.push({
          date: child.val().date,
          items: child.val().items,
          id: child.key
        });
    });
    result.isLoading = false;
    console.log(result);
    return result;
   
  } catch (e) {
    console.log(e);
  }
};

