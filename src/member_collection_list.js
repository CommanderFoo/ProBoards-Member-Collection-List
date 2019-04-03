class Member_Collection_List {

	static init(){
		if(typeof yootil == "undefined"){
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

	static ready(){
		if(yootil.location.profile()){
			this.create_tab();
		}
	}

	static create_tab(){
		let active = (location.href.match(/\/member-collection-list/i))? true : false;

		yootil.create.profile_tab("Collection List", "member-collection-list", active);

		if(active){
			let $content_wrapper = $(".show-user div.content .pad-all-double:last");

			$content_wrapper.find("> *").hide();

			let user_id = yootil.page.member.id();
			let $collection = $("<div id='collection-list' class='collection-list'></div>");

			$collection.append(this.get_html());

			let $button = $collection.find("#save-collection-list");

			if(user_id != yootil.user.id()){
				$collection.find(".collection-list-footer").hide();

				if(this.EMPTY){
					$collection.find(".collection-list-items").html("<em>This member has no saved items in their list.</em>");
				}
			} else {
				$button.on("click", function(){

					if(!Member_Collection_List.editing){
						let collection = yootil.key.value(Member_Collection_List.KEY, user_id) || [];

						Member_Collection_List.editing = true;
						Member_Collection_List.refresh_list(true);

						$(".collection-list-items input[type=checkbox]").each((i, item) => {

							if($.inArrayLoose(item.value, collection) > -1){
								$(item).prop("checked", "checked");
							}

						});

						$button.text("Save List");
					} else {
						Member_Collection_List.editing = false;

						$button.text("Edit List");

						let data = [];

						$(".collection-list-items input:checked").each((i, item) => {

							if(Member_Collection_List.LIST.has(item.value)){
								data.push(item.value);
							}
						});

						yootil.key.set(Member_Collection_List.KEY, data, user_id);

						Member_Collection_List.refresh_list(false);

						if(Member_Collection_List.EMPTY){
							$(".collection-list-items").html("<em>You have no saved items in your list.</em>");
						}
					}
				});

				if(this.EMPTY){
					$collection.find(".collection-list-items").html("<em>You have no saved items in your list.</em>");
				}
			}

			$content_wrapper.prepend($collection);
		}
	}

	static refresh_list(edit){
		this.create_lists();

		$(".collection-list-items").empty().append((edit)? this.EDIT : this.VIEW);
	}

	static get_html(){
		let tpl = Member_Collection_List.TEMPLATE;

		if(!tpl.match("{foreach item}") || !tpl.match("{/foreach}")){
			return;
		}

		tpl = tpl.split("{foreach item}");

		let pre_loop_content = tpl[0];

		tpl = tpl[1].split("{/foreach}");

		this.LOOP_CONTENT = tpl[0];
		let post_loop_content = tpl[1];

		this.create_lists();

		return pre_loop_content + Member_Collection_List.VIEW + post_loop_content;
	}

	static parse_if(content){
		let blocks = {

			edit: "",
			view: ""

		};

		let parts = content.split("{if editing}");

		blocks.edit = parts[1].split("{else}")[0];
		blocks.view = parts[1].split("{else}")[1].split("{/if}")[0];

		return blocks;
	}

	static create_lists(){
		let user_id = yootil.page.member.id();
		let collection = yootil.key.value(this.KEY, user_id) || [];

		Member_Collection_List.EDIT = Member_Collection_List.VIEW = "";

		this.EMPTY = true;

		for(let entry of this.LIST.entries()){
			let blocks = this.parse_if(this.LOOP_CONTENT);

			if($.inArrayLoose(entry[0], collection) > -1){
				Member_Collection_List.VIEW += blocks.view.replace("{item.name}", entry[1]);
				this.EMPTY = false;
			}

			Member_Collection_List.EDIT += blocks.edit.replace("{item.value}", entry[0]).replace("{item.name}", entry[1]);
		}
	}

	static setup(){
		let plugin = pb.plugin.get(this.ID);

		if(plugin && plugin.settings){
			let settings = plugin.settings;

			this.TEMPLATE = settings.template;

			for(let i = 0; i < settings.items.length; ++ i){
				this.LIST.set(settings.items[i].unique_id, settings.items[i].name);
			}
		}
	}

}