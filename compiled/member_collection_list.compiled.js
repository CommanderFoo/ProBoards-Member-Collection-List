"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Member_Collection_List = function () {
	function Member_Collection_List() {
		_classCallCheck(this, Member_Collection_List);
	}

	_createClass(Member_Collection_List, null, [{
		key: "init",
		value: function init() {
			if (typeof yootil == "undefined") {
				return;
			}

			this.ID = "pd_member_collection_list";
			this.KEY = "pd_member_collection_list";

			this.LIST = new Map();

			this.TEMPLATE = "";

			this.LOOP_CONTENT = "";
			this.EDIT = "";
			this.VIEW = "";

			this.EMPTY = true;

			this.editing = false;

			this.setup();

			$(this.ready.bind(this));
		}
	}, {
		key: "ready",
		value: function ready() {
			if (yootil.location.profile()) {
				this.create_tab();
			}
		}
	}, {
		key: "create_tab",
		value: function create_tab() {
			var active = location.href.match(/\/member-collection-list/i) ? true : false;

			yootil.create.profile_tab("Collection List", "member-collection-list", active);

			if (active) {
				var $content_wrapper = $(".show-user div.content .pad-all-double:last");

				$content_wrapper.find("> *").hide();

				var user_id = yootil.page.member.id();
				var $collection = $("<div id='collection-list' class='collection-list'></div>");

				$collection.append(this.get_html());

				var $button = $collection.find("#save-collection-list");

				if (user_id != yootil.user.id()) {
					$collection.find(".collection-list-footer").hide();

					if (this.EMPTY) {
						$collection.find(".collection-list-items").html("<em>This member has no saved items in their list.</em>");
					}
				} else {
					$button.on("click", function () {

						if (!Member_Collection_List.editing) {
							var collection = yootil.key.value(Member_Collection_List.KEY, user_id) || [];

							Member_Collection_List.editing = true;
							Member_Collection_List.refresh_list(true);

							$(".collection-list-items input[type=checkbox]").each(function (i, item) {

								if ($.inArrayLoose(item.value, collection) > -1) {
									$(item).prop("checked", "checked");
								}
							});

							$button.text("Save List");
						} else {
							Member_Collection_List.editing = false;

							$button.text("Edit List");

							var data = [];

							$(".collection-list-items input:checked").each(function (i, item) {

								if (Member_Collection_List.LIST.has(item.value)) {
									data.push(item.value);
								}
							});

							yootil.key.set(Member_Collection_List.KEY, data, user_id);

							Member_Collection_List.refresh_list(false);

							if (Member_Collection_List.EMPTY) {
								$(".collection-list-items").html("<em>You have no saved items in your list.</em>");
							}
						}
					});

					if (this.EMPTY) {
						$collection.find(".collection-list-items").html("<em>You have no saved items in your list.</em>");
					}
				}

				$content_wrapper.prepend($collection);
			}
		}
	}, {
		key: "refresh_list",
		value: function refresh_list(edit) {
			this.create_lists();

			$(".collection-list-items").empty().append(edit ? this.EDIT : this.VIEW);
		}
	}, {
		key: "get_html",
		value: function get_html() {
			var tpl = Member_Collection_List.TEMPLATE;

			if (!tpl.match("{foreach item}") || !tpl.match("{/foreach}")) {
				return;
			}

			tpl = tpl.split("{foreach item}");

			var pre_loop_content = tpl[0];

			tpl = tpl[1].split("{/foreach}");

			this.LOOP_CONTENT = tpl[0];
			var post_loop_content = tpl[1];

			this.create_lists();

			return pre_loop_content + Member_Collection_List.VIEW + post_loop_content;
		}
	}, {
		key: "parse_if",
		value: function parse_if(content) {
			var blocks = {

				edit: "",
				view: ""

			};

			var parts = content.split("{if editing}");

			blocks.edit = parts[1].split("{else}")[0];
			blocks.view = parts[1].split("{else}")[1].split("{/if}")[0];

			return blocks;
		}
	}, {
		key: "create_lists",
		value: function create_lists() {
			var user_id = yootil.page.member.id();
			var collection = yootil.key.value(this.KEY, user_id) || [];

			Member_Collection_List.EDIT = Member_Collection_List.VIEW = "";

			this.EMPTY = true;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.LIST.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var entry = _step.value;

					var blocks = this.parse_if(this.LOOP_CONTENT);

					if ($.inArrayLoose(entry[0], collection) > -1) {
						Member_Collection_List.VIEW += blocks.view.replace("{item.name}", entry[1]);
						this.EMPTY = false;
					}

					Member_Collection_List.EDIT += blocks.edit.replace("{item.value}", entry[0]).replace("{item.name}", entry[1]);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: "setup",
		value: function setup() {
			var plugin = pb.plugin.get(this.ID);

			if (plugin && plugin.settings) {
				var settings = plugin.settings;

				this.TEMPLATE = settings.template;

				for (var i = 0; i < settings.items.length; ++i) {
					this.LIST.set(settings.items[i].unique_id, settings.items[i].name);
				}
			}
		}
	}]);

	return Member_Collection_List;
}();


Member_Collection_List.init();