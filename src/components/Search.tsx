import { useCallback, useEffect, useRef, useState } from "react";
import { ColorId, SearchOrderBy, createApi } from "unsplash-js";
import Gallery from "./Gallery";
import { Photos } from "unsplash-js/dist/methods/search/types/response";
import { ApiResponse } from "unsplash-js/dist/helpers/response";
import Pagination from "./Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import "./search.css";

const UNSPLASH_ACCESS_KEY = "ukJyK7f_oSD8sRs6GytnZxaxCnv8XCiFi05QKrF_BeQ";

const Search: React.FC = () => {
	const unsplash = createApi({
		// accessKey: process.env.REACT_APP_UNSPLASH_KEY as string,
		accessKey: UNSPLASH_ACCESS_KEY,
	});
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
				<div className="searchLabel">Enter search terms:</div>
				<form className="form" onSubmit={handleSubmit}>
					<input
						type="text"
						name="query"
						className="input"
						placeholder={`search`}
						ref={searchInput}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<FontAwesomeIcon className="searchGlass" icon={faMagnifyingGlass} />
					<button type="submit" className="searchButton">
						Search
					</button>
				</form>
				<div className="filters">
					Sort and filter:
					<select
						className="selectMenu"
						onChange={(e) => {
							if (e.target.value === "latest") {
								setOrder("latest");
							} else {
								setColor(e.target.value as ColorId);
							}
							resetSearch();
						}}
					>
						<option value="">Select filter</option>
						<option value="black_and_white">Black and White</option>
						<option value="black">Black</option>
						<option value="white">White</option>
						<option value="yellow">Yellow</option>
						<option value="orange">Orange</option>
						<option value="red">Red</option>
						<option value="purple">Purple</option>
						<option value="magenta">Magenta</option>
						<option value="green">Green</option>
						<option value="teal">Teal</option>
						<option value="blue">Blue</option>
						<option value="latest">Latest Images</option>
					</select>
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
