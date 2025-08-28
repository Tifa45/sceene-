import axios from "axios";
import { useEffect, useState } from "react";
import PanelActivityTile from "./panel-activity-tile";
import NoShowsFound from "./no-shows-found";
import Pagination from "./pagination";
import { useForm } from "react-hook-form";
import { models, operations } from "../lib/constans";
import { useUserStore } from "../stores/user-store";
import api from "../lib/axios-utils";

function Actitvities({ selectedUser }) {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { model: "", operation: "", startDate: "", endDate: "" },
    mode: "onChange",
  });

  const filterInitialValues = {
    model: "",
    operation: "",
    startDate: "",
    endDate: "",
  };

  const modelFilter = watch("model");
  const operationFilter = watch("operation");
  const startDateFilter = watch("startDate");

  const [logs, setLogs] = useState([]);
  const [totalFound, setTotalFound] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState(filterInitialValues);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);

  function handleCurrentPage(page, prev, next) {
    if (page || page === 0) {
      setCurrentPage(page);
    }
    if (prev) {
      setCurrentPage((current) => current - 1);
    }
    if (next) {
      setCurrentPage((current) => current + 1);
    }
  }

  async function getLogs(currentUser) {
    setLoading(true);
    try {
      const response = await api.get(
        `/logs/get-logs?page=${currentPage}&updatedBy=${
          currentUser ?? ""
        }&model=${filters.model}&operation=${filters.operation}&startDate=${
          filters.startDate
        }&endDate=${filters.endDate}`
      );
      const { total, totalPages, logsData } = response.data;
      setLogs(logsData);
      setTotalPages(totalPages);
      setErrMsg(null);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setErrMsg(error.response.data.message || error.message);
      } else {
        setErrMsg("Unexpected error!");
      }
    }
    setLoading(false);
  }

  async function onSubmit(data) {
    setCurrentPage(0);
    setFilters(data);
  }

  useEffect(() => {
    getLogs(selectedUser);
  }, [currentPage, filters, selectedUser]);

  return (
    <div className="h-full overflow-hidden pb-78">
      <div className="p-2 space-y-2 mb-2">
        <p>Filter by:</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-4 items-center"
        >
          <div className=" p-2 space-y-2">
            <p>Model Type:</p>
            <select
              {...register("model")}
              className="bg-primary rounded-lg outline-none border p-1"
            >
              <option value="" selected={modelFilter === ""} hidden>
                Select Model
              </option>
              {models.map((model) => (
                <option
                  key={model}
                  value={model}
                  selected={modelFilter === model}
                >
                  {model}
                </option>
              ))}
            </select>
          </div>
          <div className=" p-2 space-y-2">
            <p>Opertation Type:</p>
            <select
              {...register("operation")}
              className="bg-primary rounded-lg outline-none border p-1"
            >
              <option value="" selected={operationFilter === ""} hidden>
                Select Operation
              </option>
              {operations.map((operation) => (
                <option
                  key={operation}
                  value={operation}
                  selected={operationFilter === operation}
                >
                  {operation}
                </option>
              ))}
            </select>
          </div>
          <div className="p-2 space-y-2">
            <p>Start Date:</p>
            <input
              type="date"
              {...register("startDate")}
              className=" bg-gray-100/20 p-1 rounded-lg "
            />
          </div>
          <div className="p-2 space-y-2">
            <p>End Date:</p>
            <input
              type="date"
              disabled={startDateFilter === ""}
              {...register("endDate", {
                validate: (v) => {
                  const startDateValue = new Date(startDateFilter);
                  const endDateValue = new Date(v);
                  return (
                    v === "" ||
                    (startDateFilter !== "" &&
                      endDateValue >= startDateValue) ||
                    "End date must be greater thant start date!"
                  );
                },
              })}
              className=" bg-gray-100/20 p-1 rounded-lg "
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>
          <div className="flex gap-4 pb-2 mt-auto">
            <button
              disabled={isSubmitting}
              type="reset"
              onClick={() => {
                reset();
                setFilters(filterInitialValues);
              }}
              className="bg-hover py-1 px-4 rounded-md border"
            >
              Clear
            </button>
            <button
              disabled={isSubmitting}
              type="submit"
              className="bg-secondary py-1 px-4 rounded-md border"
            >
              Filter
            </button>
          </div>
        </form>
      </div>
      <div className="flex items-center px-4 py-2 bg-secondary rounded-md  border mb-4 ">
        <div className="w-[20%]  ">
          <p>Updated By</p>
        </div>
        <div className="w-[20%] ">
          <p>Model</p>
        </div>
        <div className="w-[20%] ">
          <p>Operation</p>
        </div>
        <div className="w-[20%] ">
          <p>Date</p>
        </div>
        <div className="w-[20%] ">
          <p>Detials</p>
        </div>
      </div>
      <div className="space-y-4 h-full overflow-y-scroll [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-thumb]:bg-gray-500/50 [&::-webkit-scrollbar-thumb]:rounded-md">
        {loading ? (
          <NoShowsFound msg="Loading..." />
        ) : errMsg ? (
          <NoShowsFound msg={errMsg} />
        ) : (
          logs &&
          logs.length > 0 && (
            <>
              {logs.map((log) => (
                <PanelActivityTile key={log._id} log={log} />
              ))}
            </>
          )
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          handlePage={handleCurrentPage}
          shift={3}
          pagesCount={6}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}

export default Actitvities;
