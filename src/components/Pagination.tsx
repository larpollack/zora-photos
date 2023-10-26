import React from "react";

type PaginationProps = {
	page: number;
	totalPages: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
};

const Pagination: React.FC<PaginationProps> = ({
	page,
	totalPages,
	setPage,
}) => {
	return (
		<div className="pagination">
			{page > 1 && <button onClick={() => setPage(page - 1)}>Previous</button>}
			{page < totalPages && (
				<button onClick={() => setPage(page + 1)}>Next</button>
			)}
		</div>
	);
};

export default Pagination;
