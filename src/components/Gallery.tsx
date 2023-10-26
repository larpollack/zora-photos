import React from "react";
import "./gallery.css";

type UnsplashImage = {
	id: string;
	urls: {
		large?: string;
		regular?: string;
		small?: string;
	};
	links: {
		html?: string;
	};
	color?: string | null;
	alt_description?: string;
};

const Gallery: React.FC<{ pic: UnsplashImage }> = ({ pic }) => {
	const { urls } = pic;

	return (
		<>
			<div className="imageWrapper">
				<img className="pics" src={urls.small} alt="" />
			</div>
		</>
	);
};

export default Gallery;
