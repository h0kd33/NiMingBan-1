(function (window, document) {

    new Vue({
        el: '.posts-board',
        data: {
            posts: [],
            board_id: "0",
            page: "1",
            post_id: "0",
            board_obj: {},
            paginate: {},
            csrf_token: ""
        },
        ready: function(){
          var options = {};
          options.params = {
            board_id: config.current_board,
            page: config.current_page,
            post_id: config.current_post_id
          };
          this.$set("board_id", config.current_board);
          this.$set("page", Number(config.current_page));
          this.$set("post_id", Number(config.current_post_id));

          this.$http.get('/api/v1/boards').then(function(response){
            var board_obj = response.json();
            this.$set("board_obj", board_obj);

          }, function(response){});

          var url = "/api/v1/posts"
          if(this.post_id > 0){
            url = url + "/" + this.post_id;
          }

          this.$http.get(url, options).then(function(response){
            // 文章列表
            var post_list_obj = response.json();
            // console.log(post_list_obj);
            this.$set("posts", post_list_obj.data);
            this.$set("paginate", post_list_obj.paginate);

            this.$nextTick(function () {
              // var all_lightbox = UIkit.lightbox(".post.first > a[title='post image']");
              // var all_sub_lightbox = UIkit.lightbox(".post.item > a[title='subpost image']");
              var pagination = UIkit.pagination(
                                ".pagination > .uk-pagination",
                                {
                                  "pages" : this.paginate.pages,
                                  "currentPage" : this.paginate.current_page - 1,
                                  "onSelectPage": this.reload_content
                                }
                              );
            });



            // // paginate url
            // var base_paginate_url = "/board/?";
            // base_paginate_url += "board_id=" + this.board_id;
            // base_paginate_url += "&";
            // base_paginate_url += "post_id=" + this.post_id;
            //

          }, function(response){});
        },
        methods:{
          reload_content: function(page_index){
            var page = page_index + 1;
            var base_paginate_url = "/board/?";
            base_paginate_url += "board_id=" + this.board_id;
            base_paginate_url += "&";
            base_paginate_url += "post_id=" + this.post_id;

            page_url = base_paginate_url + "&page=" + page;

            window.location.href = page_url;

          },
          report_post: function(post_id, content){
            var url = "/api/v1/reports";

            var options = {};
            options.headers = {
              "X-CSRF-TOKEN": this.csrf_token
            };

            var body = {
              post_id: post_id,
              content: content
            }

            this.$http.post(url, body, options).then(
              function(response){
                UIkit.notify({
                  message : '举报成功...',
                  status  : 'danger',
                  timeout : 5000,
                  pos     : 'top-right'
                });
                console.log(response);
              },
              function(response){}
            );
          },
          report_post_model: function(event, post_id){
            var vm = this;
            UIkit.modal.prompt("举报理由:", "", function(newvalue){
              vm.report_post(post_id, newvalue);
            });
          }
        }

    });

}(this, this.document));
