// useFetch is a custom hook
// it takes the url and fetch options as parameters
// it also takes a callback function to generalize the purpose of the helper function
// it gives the ok, status, and response object to the callback function as an object
// when failed to fetch, it sets the error to errorContext
export default function useFetch() {

  const setResponse = async (url, options, callback) => {
    try {
      const res = await fetch(url, options);
      const { ok, status } = res;
      const data = await res.json();
      // setError(null);
      return callback({ ok, status, data });
    } catch (err) {
      console.log(err);
    }
  };

  return { setResponse };
}
