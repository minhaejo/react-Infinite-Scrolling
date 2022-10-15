import axios from "axios";
import { useState, useEffect } from "react";

const useBookSearch = (query, pageNumber) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setBooks([]);
  }, [query]); //쿼리가 바뀔때마다 빈배열로 초기화 하고

  useEffect(() => {
    //여기서 데이터 패칭 다시 하는거
    setLoading(true);
    setError(false);
    let cancel;
    axios
      .get("http://openlibrary.org/search.json", {
        params: { q: query, page: pageNumber },
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {
        setBooks((prevBooks) => {
          //업데이트함수
          return [
            ...new Set([
              //중복제거
              ...prevBooks, //업데이트함수의 초기값
              ...res.data.docs.map((book) => book.title), //내용을 추가하는거
            ]),
          ];
        });
        setHasMore(res.data.docs.length > 0);
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return { loading, error, books, hasMore };
};

export default useBookSearch;

//에러
//로딩
//데이터패칭
//

//http://openlibrary.org/search.json
