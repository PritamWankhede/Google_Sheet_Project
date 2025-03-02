import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, MenuList, MenuButton, Portal, MenuItem } from "@chakra-ui/react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import Pagination from "@/components/Pagination";
import Avatar from "@/components/Avatar";
import { createSheet, getSheetList, removeSheetById } from "@/services/Sheet";
import { getStaticUrl, debounce } from "@/utils";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const SheetList = () => {
  const [sheets, setSheets] = useState([]);
  const [pageMeta, setPageMeta] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const containerRef = useRef(null);

  const searchParams = new URLSearchParams(location.search);
  let search = searchParams.get("search") || "";
  let page = searchParams.get("page") || 1;

  useEffect(() => {
    getSheetDetails();
  }, [search, page]);

  const getSheetDetails = async () => {
    try {
      let response = await getSheetList({ limit: 15, search, page: +page });
      let { sheets, pageMeta } = response.data.data;
      setSheets(sheets);
      setPageMeta(pageMeta);
    } catch (err) {
      toast.error(err?.message);
    } finally {
      if (isLoading) setIsLoading(false);
    }
  };

  const handleCreateDocument = async () => {
    try {
      let response = await createSheet();
      let { sheetId } = response.data.data;
      navigate(`/sheet/${sheetId}`);
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handleDeleteDocument = async (sheetId) => {
    if (!window.confirm("Are you sure to delete this form?")) return;
    try {
      await removeSheetById(sheetId);
      getSheetDetails();
    } catch (error) {
      toast.error(error?.message);
    }
  };

  const handlePageChange = (page) => {
    if (!containerRef.current) return;
    navigate({
      search:
        page !== 0
          ? `?page=${page + 1}${search ? `&search=${search}` : ""}`
          : "",
    });
    containerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const navigateToSheet = (sheetId, newTab = false) => {
    let path = `/sheet/${sheetId}`;
    newTab ? window.open(`#${path}`) : navigate(path);
  };

  const handleChange = debounce(({ target: { value } }) => {
    navigate({ search: value ? `?search=${value}` : "" });
  }, 500);

  return (
    <Fragment>
      <div className="sticky h-[var(--header-height)] grid grid-cols-[250px_1fr_75px] place-content-center bg-[white] z-[999] p-[15px] border-b-[#dadce0] border-b border-solid left-0 top-0">
        <div className="flex items-center gap-2">
          <img className="w-12 h-12" src={getStaticUrl("/logo.png")} />
          <span className="font-medium text-[#5f6368] text-xl">
            Google Sheets
          </span>
        </div>
        <div className="relative flex items-center justify-center">
          <input
            className="h-[45px] max-w-screen-md w-full outline-none bg-[#f1f3f4] border pl-[15px] pr-10 py-0 rounded-lg border-solid border-transparent focus:shadow-[0_1px_1px_0_rgba(65,69,73,0.3),0_1px_3px_1px_rgba(65,69,73,0.15)] focus:bg-[rgba(255,255,255,1)]"
            placeholder="Search by title"
            defaultValue={search || ""}
            onChange={handleChange}
          />
          <i className="bx-search relative text-[22px] w-[35px] h-[35px] flex justify-center items-center text-[#606368] text-2xl cursor-pointer rounded-[50%] right-10 hover:bg-[#dadce0]"></i>
        </div>
        {user && <Avatar user={user} logout={logout} />}
      </div>
      {isLoading ? (
        <div>
          <span>Loading...</span>
        </div>
      ) : (
        <Fragment>
          <table ref={containerRef} className="max-w-[1024px] w-full mx-auto my-0 border-collapse mt-6">
            <thead>
              <tr>
                <th className="w-[50%] text-left p-3 pl-7">Title</th>
                <th className="w-[20%] text-center p-3">Created at</th>
                <th className="w-[20%] text-center p-3">Last opened by me</th>
                <th className="w-[10%] text-center p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {sheets.length === 0 ? (
                <tr>
                  <td className="py-6 text-center" colSpan={5}>
                    No Records Found
                  </td>
                </tr>
              ) : (
                sheets.map(({ title, _id, createdAt, lastOpenedAt }) => (
                  <tr
                    key={_id}
                    className="h-14 transition-colors hover:bg-[#E5F4EA] cursor-pointer"
                    onClick={() => navigateToSheet(_id)}
                  >
                    <td className="p-3 flex items-center gap-4 font-medium pl-4">
                      <img className="w-6 h-6" src={getStaticUrl("/favicon.ico")} />
                      {title}
                    </td>
                    <td className="text-center p-3">
                      {dayjs.tz(new Date(createdAt), "Asia/Kolkata").format("MMM D, YYYY")}
                    </td>
                    <td className="text-center p-3">
                      {dayjs.tz(new Date(lastOpenedAt), "Asia/Kolkata").fromNow()}
                    </td>
                    <td className="p-3 flex justify-center">
                      <Menu>
                        <MenuButton className="w-8 h-8 hover:bg-[#dadce0] rounded-full">
                          <i className="bx-dots-vertical-rounded text-2xl text-gray-500"></i>
                        </MenuButton>
                        <Portal>
                          <MenuList>
                            <MenuItem onClick={() => handleDeleteDocument(_id)}>Remove</MenuItem>
                            <MenuItem onClick={() => navigateToSheet(_id, true)}>Open in new tab</MenuItem>
                          </MenuList>
                        </Portal>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {pageMeta.totalPages > 1 && <Pagination pageMeta={pageMeta} onPageChange={handlePageChange} />}
        </Fragment>
      )}
      <button className="fixed w-14 h-14 bg-white rounded-full shadow" onClick={handleCreateDocument}>
        <img className="w-6 h-6" src={getStaticUrl("/plus.svg")} />
      </button>
    </Fragment>
  );
};

export default SheetList;
