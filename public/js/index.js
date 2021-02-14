$(document).ready(function () {
	M.AutoInit();

	var projectId;

	$(document).on("click", ".edit-btn", function () {
		projectId = $(this).attr("data-id");
	});

	$(document).on("click", ".delete-btn", function () {
		projectId = $(this).attr("data-id");
	});

	$("#new-project-form").submit(function (event) {
		event.preventDefault();
		const form = $("#new-project-form")[0];
		const data = new FormData(form);
		$("#submitBtn").prop("disabled", true);

		$.ajax({
			type: "POST",
			enctype: "multipart/form-data",
			url: "/api/portfolio",
			data: data,
			processData: false,
			contentType: false,
			cache: false,
			timeout: 600000,
			success: function (res) {
				console.log("SUCCESS : ", res);
				$("#submitBtn").prop("disabled", false);
			},
			error: function (e) {
				console.log("ERROR : ", e);
				$("#submitBtn").prop("disabled", false);
			},
		});
	});

	$("#confirm-update").click(function () {
		const form = $("#edit-form")[0];
		const data = new FormData(form);

		$.ajax({
			type: "PATCH",
			enctype: "multipart/form-data",
			url: `/api/portfolio/${projectId}`,
			data: data,
			processData: false,
			contentType: false,
			cache: false,
			timeout: 600000,
			success: function (res) {
				console.log("SUCCESS : ", res);
				projectId = "";
			},
			error: function (e) {
				console.log("ERROR : ", e);
				projectId = "";
			},
		});
	});

	$("#confirm-delete").click(() => {
		$.ajax({
			type: "DELETE",
			url: `/api/portfolio/${projectId}`,
			success: function (res) {
				console.log("SUCCESS : ", res);
				projectId = "";
			},
			error: function (e) {
				console.log("ERROR : ", e);
				projectId = "";
			},
		});
	});

	$(".grid").masonry({
		itemSelector: ".grid-item",
		columnWidth: ".grid-sizer",
		gutter: 10,
	});

	const resizeProjectContainer = () => {
		const windowWidth = $(window).width();
		const imagesPerRow = Math.floor(windowWidth / 310);
		$("#my-projects").width(imagesPerRow * 310);
	};

	resizeProjectContainer();

	$(window).resize(() => {
		resizeProjectContainer();
	});
});
