import React, { useEffect, useState } from "react";
import commonGetApi from "../server/Api";
import { FiSearch } from "react-icons/fi";
import { MdClear } from "react-icons/md";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import { useLocation, useNavigate } from "react-router-dom";
export default function Home() {
  const naivagation = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsloading] = useState(true);
  const [isSearched, setIsSearched] = useState(true);
  const [bookData, setBookData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  async function getData() {
    setIsloading(true);

    const url =
      searchValue && params.get("title")
        ? `https://openlibrary.org/search.json?title=${searchValue}&page=${currentPage}&limit=20`
        : `https://openlibrary.org/people/mekBot/books/already-read.json?page=${currentPage}&limit=20`;
    const res = await commonGetApi(url);
    if (res.status == 200) {
      setIsloading(false);
      console.log(res);
      setBookData(
        !searchValue ? res?.data?.reading_log_entries : res?.data?.docs
      );
    }
  }
  useEffect(() => {
    setIsSearched(!isSearched);
    getData();
  }, [location.search]);
  const serchhandler = (e) => {
    e.preventDefault();
    console.log("Submited");
    naivagation({ search: `title=${searchValue}&page=${currentPage}` });

    // getData();
  };
  const itemsPerPage = 20;
  const totalPages = 5;
  useEffect(() => {
    naivagation({
      search:
        params.get("title") ?? false
          ? `title=${searchValue}&page=${currentPage}`
          : `page=${currentPage}`,
    });
    window.scrollTo(0, 0);
  }, [currentPage]);
  return (
    <section className="main-home-section">
      <header className="headeer">
        <form className="form" onSubmit={serchhandler}>
          <div className="search-box">
            <input
              type="text"
              required
              className={`search-input-box fs-18-14 `}
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue ? (
              <MdClear
                className="serch-icon fs-18-14 pointer"
                onClick={() => {
                  setSearchValue("");
                  naivagation({ search: `page=${currentPage}` });
                }}
              />
            ) : (
              <FiSearch className="serch-icon fs-18-14" />
            )}
            <button type="submit" className="ply-btn-css fs-18-14 fw-bold">
              Apply
            </button>
          </div>
        </form>
      </header>
      {/* =================================== BODAY SECTION START ===================== */}
      <div className="books-card-frame">
        {!isLoading ? (
          bookData && bookData.length > 0 ? (
            bookData.map((item, i) => <CardBox item={item} key={i} />)
          ) : (
            <h2 className=" w-100 text-center py-5 fw-bold text-primary">No results found</h2>
          )
        ) : (
          <div className="loading-frameframe">
            <div className="lds-spinner">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>

      {/* =================================== BODAY SECTION END ===================== */}
      {bookData.length > 10 &&
      <ResponsivePagination
        current={currentPage}
        total={5}
        onPageChange={(i) => setCurrentPage(i)}
      />
    }
    </section>
  );
}

function CardBox({ item }) {
  const [status, setStatus] = useState(false);
  return (
    <div className="book-card-box">
      <div className="book-img">
        <img
          src={`https://covers.openlibrary.org/b/id/${
            item?.cover_i || item?.work?.cover_id
          }-M.jpg`}
          alt=""
        />
      </div>
      <div className="content-info">
        <h3 className="fs-16-13 fw-600 pointer">
          {item?.title || item?.work?.title || "Na"}
        </h3>
        <p className="fs-14-12 fw-normal mb-wrap">
          <span>
            {item?.author_name?.map((item) => item) ||
              item?.work?.author_names?.map((item) => item) ||
              "Na"}
          </span>
          <span>{item?.work?.first_publish_year ||  item?.publish_year && item?.publish_year[0] || ""}</span>
          {/* <span>{ item?.publish_year[0]  || 'Na'}</span> */}
        </p>
        <button
          onClick={() => setStatus(!status)}
          className={`primary-btn ${status && "read-btn"}`}
        >
          {status ? "Read" : "Unread"}
        </button>
      </div>
    </div>
  );
}
