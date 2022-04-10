export default class RequestsService {
  getRequestsDate() {
    return fetch("requests.json")
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        return response["$values"];
      });
  }
}
