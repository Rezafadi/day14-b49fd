const express = require("express");
const app = express();
const PORT = 5000;
const path = require("path");

// setup call hbs with sub folder
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// set serving static file
app.use(express.static(path.join(__dirname, "src/assets")));
// set serving static file specific
app.use(express.static(path.join(__dirname, "src/assets/images")));

// parsing data
app.use(express.urlencoded({ extended: false }));

// sequalize init
const config = require("./src/config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);

// dummy data
// const dataBlog = [
// 	{
// 		title: "Dumbways Mobile App - 2021",
// 		content:
// 			"App that used for dumbways student, it was deployed and can downloaded on playstore. Happy download",
// 		images: "/images/project.jpeg",
// 		startDate: "2023-08-01",
// 		endDate: "2023-09-01",
// 		duration: "3 Bulan",
// 		nodejs: true,
// 		reactjs: true,
// 		nextjs: true,
// 		typescript: true,
// 	},
// 	{
// 		title: "Dumbways Mobile App - 2021",
// 		content:
// 			"App that used for dumbways student, it was deployed and can downloaded on playstore. Happy download",
// 		images: "/images/project.jpeg",
// 		startDate: "2023-08-01",
// 		endDate: "2023-09-01",
// 		duration: "3 Bulan",
// 		nodejs: true,
// 		reactjs: true,
// 		nextjs: true,
// 		typescript: true,
// 	},
// 	{
// 		title: "Dumbways Mobile App - 2021",
// 		content:
// 			"App that used for dumbways student, it was deployed and can downloaded on playstore. Happy download",
// 		images: "/images/project.jpeg",
// 		startDate: "2023-08-01",
// 		endDate: "2023-09-01",
// 		duration: "3 Bulan",
// 		nodejs: true,
// 		reactjs: true,
// 		nextjs: true,
// 		typescript: true,
// 	},
// 	{
// 		title: "Dumbways Mobile App - 2021",
// 		content:
// 			"App that used for dumbways student, it was deployed and can downloaded on playstore. Happy download",
// 		images: "/images/project.jpeg",
// 		startDate: "2023-08-01",
// 		endDate: "2023-09-01",
// 		duration: "3 Bulan",
// 		nodejs: true,
// 		reactjs: true,
// 		nextjs: true,
// 		typescript: true,
// 	},
// 	{
// 		title: "Dumbways Mobile App - 2021",
// 		content:
// 			"App that used for dumbways student, it was deployed and can downloaded on playstore. Happy download",
// 		images: "/images/project.jpeg",
// 		startDate: "2023-08-01",
// 		endDate: "2023-09-01",
// 		duration: "3 Bulan",
// 		nodejs: true,
// 		reactjs: true,
// 		nextjs: true,
// 		typescript: true,
// 	},
// ];

// routing
app.get("/", home);
app.get("/blog", blog);
app.post("/blog", addBlog);
app.get("/blog-detail/:id", blogDetail);
app.get("/contact", contactMe);
app.get("/delete-blog/:id", deleteBlog);
app.get("/edit-blog/:id", editBlog);
app.post("/update-blog/:id", updateBlog);

// local server
app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});

// module.exports = app;

// index
async function home(req, res) {
	try {
		const query = `SELECT * FROM public."Day14s";`;
		let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

		res.render("index", { dataBlog: obj });
	} catch (err) {
		console.log(err);
	}
}

// blog
function blog(req, res) {
	res.render("blog");
}

// add a new blog
async function addBlog(req, res) {
	try {
		const {
			name,
			start_date,
			end_date,
			description,
			nodejs,
			reactjs,
			nextjs,
			typescript,
		} = req.body;
		const image = "project.jpeg";

		let start = new Date(start_date);
		let end = new Date(end_date);

		if (start > end) {
			return console.log("You Fill End Date Before Start Date");
		}

		let difference = end.getTime() - start.getTime();
		let days = difference / (1000 * 3600 * 24);
		let weeks = Math.floor(days / 7);
		let months = Math.floor(weeks / 4);
		let years = Math.floor(months / 12);
		let duration = "";

		if (days > 0) {
			duration = days + " Hari";
		}
		if (weeks > 0) {
			duration = weeks + " Minggu";
		}
		if (months > 0) {
			duration = months + " Bulan";
		}
		if (years > 0) {
			duration = years + " Tahun";
		}

		// Mengubah nilai string kosong menjadi false jika checkbox tidak dipilih
		const nodejsValue = nodejs === "true" ? true : false;
		const reactjsValue = reactjs === "true" ? true : false;
		const nextjsValue = nextjs === "true" ? true : false;
		const typescriptValue = typescript === "true" ? true : false;

		await sequelize.query(
			`INSERT INTO "Day14s" (name, start_date, end_date, description, nodejs, reactjs, nextjs, typescript, image, duration) VALUES ('${name}','${start_date}','${end_date}','${description}',${nodejsValue},${reactjsValue},${nextjsValue},${typescriptValue},'${image}', '${duration}')`
		);

		res.redirect("/");
	} catch (err) {
		console.log(err);
	}
}

// edit blog
async function editBlog(req, res) {
	try {
		const id = parseInt(req.params.id);
		const query = `SELECT * FROM "Day14s" WHERE id=${id}`;
		const obj = await sequelize.query(query, {
			type: QueryTypes.SELECT,
		});
		res.render("edit-blog", { blog: obj[0], blogIndex: id });
	} catch (err) {
		console.log(err);
	}
}

// update blog
async function updateBlog(req, res) {
	try {
		const { id } = req.params;
		const {
			name,
			start_date,
			end_date,
			description,
			nodejs,
			reactjs,
			nextjs,
			typescript,
		} = req.body;
		const image = "project.jpeg";

		let start = new Date(start_date);
		let end = new Date(end_date);

		if (start > end) {
			return console.log("You Fill End Date Before Start Date");
		}

		let difference = end.getTime() - start.getTime();
		let days = difference / (1000 * 3600 * 24);
		let weeks = Math.floor(days / 7);
		let months = Math.floor(weeks / 4);
		let years = Math.floor(months / 12);
		let duration = "";

		if (days > 0) {
			duration = days + " Hari";
		}
		if (weeks > 0) {
			duration = weeks + " Minggu";
		}
		if (months > 0) {
			duration = months + " Bulan";
		}
		if (years > 0) {
			duration = years + " Tahun";
		}

		// Mengubah nilai string kosong menjadi false jika checkbox tidak dipilih
		const nodejsValue = nodejs === "true" ? true : false;
		const reactjsValue = reactjs === "true" ? true : false;
		const nextjsValue = nextjs === "true" ? true : false;
		const typescriptValue = typescript === "true" ? true : false;

		await sequelize.query(
			`UPDATE public."Day14s" SET name='${name}', start_date='${start_date}', end_date='${end_date}', description='${description}', nodejs=${nodejsValue}, reactjs=${reactjsValue}, nextjs=${nextjsValue}, typescript=${typescriptValue}, duration='${duration}', image='${image}' WHERE id=${id};`,
			{
				type: sequelize.QueryTypes.UPDATE,
			}
		);

		res.redirect("/");
	} catch (err) {
		console.log(err);
	}
}

// blog detail
async function blogDetail(req, res) {
	try {
		const { id } = req.params;
		const query = `SELECT * FROM "Day14s" WHERE id=${id}`;
		const obj = await sequelize.query(query, {
			type: QueryTypes.SELECT,
		});

		const data = obj.map((res) => ({
			...res,
		}));

		res.render("blog-detail", { blog: data[0] });
	} catch (err) {
		console.log(err);
	}
}

// contact me
function contactMe(req, res) {
	res.render("contact");
}

// Delete blog
async function deleteBlog(req, res) {
	try {
		const { id } = req.params;

		await sequelize.query(`DELETE FROM "Day14s" WHERE id = ${id};`);
		res.redirect("/");
	} catch (err) {
		console.log(err);
	}
}
