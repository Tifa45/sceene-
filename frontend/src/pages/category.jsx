import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useShowStore } from "../stores/show-store";
import { useEffect, useState } from "react";
import NoShowsFound from "../my-components/no-shows-found";
import ShowCard from "../my-components/show-card";
import Pagination from "../my-components/pagination";
import Filter from "../my-components/filter";
import api from "../lib/axios-utils";

function Category() {
  const { category } = useParams();
  const categoryShows = useShowStore((s) => s.categoryShows);
  const setCategoryShows = useShowStore((s) => s.setCategoryShows);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 0;

  const [totalFound, setTotalFound] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({});
  const [filterPages, setFilterPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  async function getCategory() {
    setLoading(true);
    if (Object.values(filters).some((v) => v.length > 0)) {
      return;
    }

    const url =
      page > 0
        ? `/shows/category/${category}?page=${page}`
        : `/shows/category/${category}`;
    try {
      const response = await api.get(url);
      const { showsData, total, totalPages } = response.data;
      setCategoryShows(showsData);
      setTotalPages(totalPages);
      setTotalFound(total);
      setErrMsg(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response?.data.message ?? error.message);
      } else {
        setErrMsg("Unexpected error!");
      }
    }
    setLoading(false);
  }

  async function filterShows() {
    setLoading(true);

    try {
      if (filterPages === 0) {
        searchParams.delete("page");
        setSearchParams(searchParams);
      }
      for (const [key, value] of Object.entries(filters)) {
        if (value.length > 0) {
          searchParams.set(key, value.join(","));
          searchParams.set("category", category);
        } else {
          searchParams.delete(key);
        }
        setSearchParams(searchParams);
      }
      const url = `http://localhost:5000/api/shows/filtered?${searchParams}`;

      const response = await axios.get(url);
      const { showsData, total, totalPages } = response.data;
      console.log(showsData);
      setCategoryShows(showsData);
      setTotalPages(totalPages);
      setTotalFound(total);
      setFilterPages(totalPages);
      setErrMsg(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message || error.message);
      } else {
        setErrMsg("Unexpected error!");
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    getCategory();
    window.scrollTo({ top: 0 });
  }, [category, page, filters]);

  useEffect(() => {
    if (Object.values(filters).some((v) => v.length > 0 && v[0] !== category)) {
      filterShows();
    } else {
      console.log("zero");
      return;
    }
  }, [filters, page]);
  console.log(totalPages);

  if (loading) return <NoShowsFound msg="Loading" />;
  return (
    <>
      <Filter
        filters={filters}
        setFilters={setFilters}
        setFilterPages={setFilterPages}
      />
      {errMsg ? (
        <NoShowsFound msg={errMsg} />
      ) : (
        <>
          {categoryShows.length === 0 ? (
            <NoShowsFound msg={"No shows found!"} />
          ) : (
            <>
              <div className="mt-8">
                {totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    searchParams={searchParams}
                    setSearchParams={setSearchParams}
                    pagesCount={6}
                    shift={3}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-8 p-6 justify-center mt-6  ">
                {categoryShows.map((show) => (
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
      )}
    </>
  );
}

export default Category;
