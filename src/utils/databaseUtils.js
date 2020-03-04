import { db } from "../config/fireBaseConfig";

export const getData = async () => {
  let result = {};
  console.log("get data");
  try {
    let loading = false;
    let productsRef = db.ref("/products");
    console.log(productsRef);
    productsRef.on("value", snapshot => {
      console.log(snapshot);
      loading = true;
      let data = [];
      snapshot.forEach(child => {
        data.push({
          name: child.val().name,
          color: child.val().color,
          producer: child.val().producer,
          price: Number(child.val().price),
          amount: Number(child.val().amount),
          id: child.key
        });
      });
      console.log(data);
      loading = false;
      result = { data, loading };
      return result;
    });
  } catch (e) {
    console.log(e);
  }
};
