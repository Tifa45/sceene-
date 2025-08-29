import { useEffect, useState } from "react";
import { useShowStore } from "../stores/show-store";
import axios from "axios";
import ShowCard from "../my-components/show-card";
import { useSearchParams } from "react-router-dom";
import NoShowsFound from "../my-components/no-shows-found";
import Pagination from "../my-components/pagination";
import Filter from "../my-components/filter";
import HeroSection from "../my-components/hero-section";
import api from "../lib/axios-utils";

function HomePage() {
  const shows = useShowStore((s) => s.shows);
  const setShows = useShowStore((s) => s.setShows);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [totalFound, setTotalFound] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({});
  const [filterPages, setFilterPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  const showHeroSection = Array.from(searchParams.values()).every(
    (v) => v.trim().length === 0
  );

  async function getShows() {
    setLoading(true);
    if (Object.values(filters).some((v) => v.length > 0)) {
      return;
    }
    try {
      const response = await api.get(`/shows?page=${page}`);
      const { showsData, total, totalPages } = response.data;
      setShows(showsData);
      setTotalPages(totalPages);
      setTotalFound(total);
      setErrMsg(null);
      window.scrollTo({ top: 0 });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message || error.message);
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
        } else {
          searchParams.delete(key);
        }
        setSearchParams(searchParams);
      }
      const url = `/shows/filtered?${searchParams}`;

      const response = await api.get(url);
      const { showsData, total, totalPages } = response.data;
      setShows(showsData);
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
    getShows();
  }, [page, filters]);

  useEffect(() => {
    if (
      Object.values(filters).some((v) => v.length > 0) ||
      searchParams.get("genre")
    ) {
      filterShows();
    } else {
      return;
    }
  }, [filters, page]);

  if (loading) return <NoShowsFound msg="Loading..." />;
  if (errMsg) return <NoShowsFound msg={errMsg} />;
  return (
    <>
      {showHeroSection && <HeroSection />}

      <div className={`${showHeroSection ? "mt-[95vh]" : ""}`}>
        <div className="">
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
        <Filter
          filters={filters}
          setFilters={setFilters}
          setFilterPages={setFilterPages}
        />
        <div className="flex flex-wrap gap-12 p-6 justify-center mt-6  ">
          {shows.map((show) => (
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
      </div>
    </>
  );
}

export default HomePage;
