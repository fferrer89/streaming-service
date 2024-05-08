const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const filePath = "/file";
const httpClientReqs = {
  uploadFile: async (file) => {
    const uploadPath = "/upload";
    try {
      // TODO: validate file
    } catch (error) {
      // throw new Response(error.message, {status: 400, statusText: 'Bad Request'});
    }
    // Create a FormData object to hold the file
    const formData = new FormData();
    formData.append("file", file, file.name);
    /*
        fetch() returns an ErrorBoundary only when there was a Network failure or something that prevented the request from
        completing. It DOES NOT return an ErrorBoundary when there was an HTTP error (Status Code of 400-500)
         */
    /*
        This request should be cached until manually invalidated. Similar to `getStaticProps`.
        `force-cache` is the default and can be omitted.
         */
    let response, responseBody;
    try {
      response = await fetch(`${baseURL}${filePath}${uploadPath}`, {
        method: "POST",
        // headers: {"Content-Type": "multipart/form-data"},
        body: formData,
        cache: "force-cache",
      });
    } catch (e) {
      throw new Error(
        "Error making the fetch request - Internal Server Error",
        { cause: e }
      );
    }
    try {
      responseBody = await response?.json();
    } catch (e) {
      throw new Error(
        `Error parsing the response to JSON - Internal Server Error | ${await response
          ?.text()
          ?.toString()}`,
        { cause: e }
      );
    }
    if (!response?.ok) {
      // It fetch() return an ErrorBoundary with (Status Code of 400-500)
      if (response?.status === 400) {
        throw new Error(
          `Error making the fetch request - ${responseBody?.message}`,
          { cause: responseBody }
        );
      } else {
        throw new Error(
          `Error making the fetch request - ${responseBody?.message}`,
          { cause: responseBody }
        );
      }
    }
    /*
        Response Body (201):
        {"message": "File uploaded successfully, stored under MongoDB ObjectID: 66380c4bfe4699689f57589b",
        "fileId": "66380c4bfe4699689f57589b"}
         */
    return responseBody?.fileId;
  },
};
export default httpClientReqs;
