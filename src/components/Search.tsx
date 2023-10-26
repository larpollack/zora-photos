import { useCallback, useEffect, useRef, useState } from "react";
import { ColorId, SearchOrderBy, createApi } from "unsplash-js";
import Gallery from "./Gallery";
import { Photos } from "unsplash-js/dist/methods/search/types/response";
import { ApiResponse } from "unsplash-js/dist/helpers/response";
import Pagination from "./Pagination";

import "./search.css";

const API_URL = "https://api.unsplash.com/search/photos";
const UNSPLASH_ACCESS_KEY = "ukJyK7f_oSD8sRs6GytnZxaxCnv8XCiFi05QKrF_BeQ";
const IMAGES_PER_PAGE = 20;

const unsplash = createApi({
	// accessKey: process.env.REACT_APP_UNSPLASH_KEY as string,
	accessKey: UNSPLASH_ACCESS_KEY,
});

const Search: React.FC = () => {
	const searchInput = useRef<HTMLInputElement>(null);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [query, setQuery] = useState<string>("");
	const [color, setColor] = useState<ColorId>();
	const [data, setData] = useState<ApiResponse<Photos> | null>(null);
	const [order, setOrder] = useState<SearchOrderBy>();

	const fetchImages = useCallback(() => {
		unsplash.search
			.getPhotos({
				query,
				color,
				orderBy: order,
				page,
				// orientation: "landscape",
			})
			.then((result) => {
				if (result.response) {
					setData(result);
					setTotalPages(result.response.total_pages);
				}
			})
			.catch(() => {
				console.log("something went wrong!");
			});
	}, [query, color, order, page]);

	useEffect(() => {
		fetchImages();
	}, [fetchImages]);

	const resetSearch = () => {
		setPage(1);
		fetchImages();
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (searchInput.current) {
			setQuery(searchInput.current.value);
		}
		resetSearch();
	};

	const handleColorSelection = (selectedColor: ColorId) => {
		setColor(selectedColor);
		resetSearch();
	};

	if (data === null) {
		return <div>Loading...</div>;
	} else if (data.errors) {
		return (
			<div>
				<div>{data.errors[0]}</div>
			</div>
		);
	} else {
		return (
			<>
				<form className="form" onSubmit={handleSubmit}>
					<input
						type="text"
						name="query"
						className="input"
						placeholder={`search`}
						ref={searchInput}
					/>

					<button type="submit" className="searchButton">
						Search
					</button>
				</form>
				<div className="filters">
					<div
						className="blackNWhite"
						onClick={() => handleColorSelection("black_and_white")}
					>
						&nbsp;&nbsp;
					</div>
					<div className="black" onClick={() => handleColorSelection("black")}>
						&nbsp;&nbsp;
					</div>
					<div className="white" onClick={() => handleColorSelection("white")}>
						&nbsp;&nbsp;
					</div>
					<div
						className="yellow"
						onClick={() => handleColorSelection("yellow")}
					>
						&nbsp;&nbsp;
					</div>
					<div
						className="orange"
						onClick={() => handleColorSelection("orange")}
					>
						&nbsp;&nbsp;
					</div>
					<div className="red" onClick={() => handleColorSelection("red")}>
						&nbsp;&nbsp;
					</div>
					<div
						className="purple"
						onClick={() => handleColorSelection("purple")}
					>
						&nbsp;&nbsp;
					</div>
					<div
						className="magenta"
						onClick={() => handleColorSelection("magenta")}
					>
						&nbsp;&nbsp;
					</div>
					<div className="green" onClick={() => handleColorSelection("green")}>
						&nbsp;&nbsp;
					</div>
					<div className="teal" onClick={() => handleColorSelection("teal")}>
						&nbsp;&nbsp;
					</div>
					<div className="blue" onClick={() => handleColorSelection("blue")}>
						&nbsp;&nbsp;
					</div>
					<button className="latest" onClick={() => setOrder("latest")}>
						Latest
					</button>
				</div>
				<div className="feed">
					{data.response.results.map((pic) => (
						<Gallery
							key={pic.id}
							pic={{ ...pic, alt_description: pic.alt_description || "" }}
						/>
					))}
				</div>
				<Pagination page={page} totalPages={totalPages} setPage={setPage} />
			</>
		);
	}
};

export default Search;
