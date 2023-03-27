export const setConnectCounter = async (count) => {
  console.log('setConnectCounter');

  await SecureStore.setItemAsync('ConnectCounter', JSON.stringify(count))
  .catch((error) => {
    console.log(`setConnectCounter error \n`, error);
    // throw error
  });
}

export const getConnectCounter = async () => {
  console.log('getConnectCounter');
  try {
    const ConnectCounter = await SecureStore.getItemAsync('ConnectCounter');
      return JSON.parse(ConnectCounter)
    
  } catch (error) {
    console.log(`getConnectCounter error \n`, error);
  }
}