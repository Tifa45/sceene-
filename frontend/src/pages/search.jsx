import { useLocation, useSearchParams } from "react-router-dom";
import NoShowsFound from "../my-components/no-shows-found";
import { useEffect, useState } from "react";
import axios from "axios";
import ShowCard from "../my-components/show-card";
import Pagination from "../my-components/pagination";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = useLocation().search;

  const page = Number(searchParams.get("page")) || 0;

  const [matchedShows, setMatchedShows] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoding] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const getSearchedShows = async () => {
   
    const url = `http://localhost:5000/api/shows/search${query}&${page}`;
    setLoding(true);
    try {
      const response = await axios.get(url);
      const { showsData, total, totalPages } = response.data;
      setMatchedShows(showsData);
      setTotalPages(totalPages);
      setTotalFound(total);
      setErrMsg(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message || error.message);
      } else {
        setErrMsg("Unexpected error!");
      }
    }
    setLoding(false);
  };

  useEffect(() => {
    getSearchedShows();
  }, [page, query]);

  if (loading) return <NoShowsFound msg="Loading..." />;
  if (errMsg) return <NoShowsFound msg={errMsg} />;
  return (
    <>
      {!matchedShows || matchedShows.length === 0 ? (
        <NoShowsFound msg="No matched search!" />
      ) : (
        <>
          <h1 className="mt-8">{totalFound} show found</h1>
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              pagesCount={6}
              shift={3}
            />
          )}
          <div className="flex flex-wrap gap-12 p-6 justify-center mt-8  ">
            {matchedShows.map((show) => (
              <ShowCard key={show._id} show={show} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              pagesCount={6}
              shift={3}
            />
          )}
        </>
      )}
    </>
  );
}

export default Search;
