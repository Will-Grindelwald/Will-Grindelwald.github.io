!function(e,t,a,i){"use strict";function r(t,a){this.container=e(t),this.widgetHead=null,this.widgetBody=null,this.settings=e.extend({},l,a),this.realTimeout=this.settings.timeout,this.init()}var l={username:"octocat",timeout:300,debug:!0},o=function(){var a={capitalize:function(e){return e.charAt(0).toUpperCase()+e.slice(1)},date:function(a){var i=new Date(a);return t.moment?t.moment(i).fromNow():e.timeago?e.timeago(i):i.getMonth()+1+"-"+i.getDate()+"-"+i.getFullYear()},issueType:function(e){return e.pull_request&&e.pull_request.html_url&&e.pull_request.diff_url&&e.pull_request.patch_url?"pull request":"issue"},tail:function(e){return e.split("/").pop()}},i={boilerplate:function(){return'<div class="activity"><div class="activity-head"></div><ul class="activity-body"></ul><div class="activity-foot"><a href="https://github.com/smuyyh">Powered by smuyyh</a></div></div>'},profileWithName:function(e){var t=e.avatar_url,a=e.name,i=e.login;return'<a href="https://github.com/'+i+'"><img src="'+t+'"></a><h4><a href="https://github.com/'+i+'">'+a+'</a></h4><small><a href="https://github.com/'+i+'">'+i+'</a></small><div class="clearfix"></div>'},profileWithoutName:function(e){var t=e.avatar_url,a=e.login;return'<a href="https://github.com/'+a+'"><img src="'+t+'"></a><h4><a href="https://github.com/'+a+'">'+a+'</a></h4><div class="clearfix"></div>'},commentOnCommit:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name;return'<li id="'+t+'">Commented on commit <a href="'+e.payload.comment.html_url+'">'+e.payload.comment.commit_id.substring(0,7)+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},createRepository:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name;e.payload.ref;return'<li id="'+t+'">Created repository <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},createBranch:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.ref;return'<li id="'+t+'">Created branch <a href="https://github.com/'+r+"/tree/"+l+'">'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},createTag:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.ref;return'<li id="'+t+'">Created tag <a href="https://github.com/'+r+"/tree/"+l+'">'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},deleteBranch:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name;return'<li id="'+t+'">Deleted branch '+e.payload.ref+' at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},deleteTag:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name;return'<li id="'+t+'">Deleted tag '+e.payload.ref+' at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},createDownload:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.download.name;return'<li id="'+t+'">Created download <a href="'+e.payload.download.html_url+'">'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},followUser:function(e){var t=e.id,i=a.date(e.created_at),r=e.payload.target.login;return'<li id="'+t+'">Started following <a href="'+e.payload.target.html_url+'">'+r+"</a> <small>"+i+"</small></li>"},applyPatch:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name;return'<li id="'+t+'">Applied a patch to <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},forkRepository:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.forkee.full_name;return'<li id="'+t+'">Forked <a href="https://github.com/'+r+'">'+r+'</a> to <a href="https://github.com/'+l+'">'+l+"</a> <small>"+i+"</small></li>"},createGist:function(e){var t=e.id,i=a.date(e.created_at),r=e.payload.gist.id;return'<li id="'+t+'">Created gist <a href="'+e.payload.gist.html_url+'">'+r+"</a> <small>"+i+"</small></li>"},updateGist:function(e){var t=e.id,i=a.date(e.created_at),r=e.payload.gist.id;return'<li id="'+t+'">Updated gist <a href="'+e.payload.gist.html_url+'">'+r+"</a> <small>"+i+"</small></li>"},editWiki:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name;return'<li id="'+t+'">Edited the wiki at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},commentOnIssue:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.issue.number;return'<li id="'+t+'">Commented on issue <a href="'+e.payload.comment.html_url+'">#'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},commentOnPullRequest:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.issue.number;return'<li id="'+t+'">Commented on pull request <a href="'+(e.payload.issue.pull_request.html_url+"#issuecomment-"+e.payload.comment.id)+'">#'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},openIssue:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.issue.number;return'<li id="'+t+'">Opened issue <a href="'+e.payload.issue.html_url+'">#'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},closeIssue:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.issue.number;return'<li id="'+t+'">Closed issue <a href="'+e.payload.issue.html_url+'">#'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},reopenIssue:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.issue.number;return'<li id="'+t+'">Reopened issue <a href="'+e.payload.issue.html_url+'">#'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},addUserToRepository:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.member.login;return'<li id="'+t+'">Added <a href="'+e.payload.member.html_url+'">'+l+'</a> to <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},openSourceRepository:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name;return'<li id="'+t+'">Open sourced repository <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},openPullRequest:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.number;return'<li id="'+t+'">Opened pull request <a href="https://github.com/'+r+"/pull/"+l+'">#'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},closePullRequest:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.number;return'<li id="'+t+'">Closed pull request <a href="https://github.com/'+r+"/pull/"+l+'">#'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},reopenPullRequest:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.number;return'<li id="'+t+'">Reopened pull request <a href="https://github.com/'+r+"/pull/"+l+'">#'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},synchronizePullRequest:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.number;return'<li id="'+t+'">Synchronized pull request <a href="https://github.com/'+r+"/pull/"+l+'">#'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},commentOnPullRequestDiff:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name;return'<li id="'+t+'">Commented on pull request <a href="'+e.payload.comment.html_url+'">#'+a.tail(e.payload.comment.pull_request_url)+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},pushToBranch:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=1===e.payload.size?"1 commit ":e.payload.size+" commits ",o=a.tail(e.payload.ref);return'<li id="'+t+'">Pushed '+l+'to <a href="https://github.com/'+r+"/tree/"+o+'">'+o+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},createRelease:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name,l=e.payload.release.name;return'<li id="'+t+'">Created release <a href="'+e.payload.release.html_url+'">'+l+'</a> at <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"},starRepository:function(e){var t=e.id,i=a.date(e.created_at),r=e.repo.name;return'<li id="'+t+'">Starred repository <a href="https://github.com/'+r+'">'+r+"</a> <small>"+i+"</small></li>"}},r=function(e,t){if("boilerplate"===e)return i.boilerplate();if("profile"===e)return t.name?i.profileWithName(t):i.profileWithoutName(t);if("event"===e){if("CommitCommentEvent"===t.type)return i.commentOnCommit(t);if("CreateEvent"===t.type&&"repository"===t.payload.ref_type)return i.createRepository(t);if("CreateEvent"===t.type&&"branch"===t.payload.ref_type)return i.createBranch(t);if("CreateEvent"===t.type&&"tag"===t.payload.ref_type)return i.createTag(t);if("DeleteEvent"===t.type&&"branch"===t.payload.ref_type)return i.deleteBranch(t);if("DeleteEvent"===t.type&&"tag"===t.payload.ref_type)return i.deleteTag(t);if("DownloadEvent"===t.type)return i.createDownload(t);if("FollowEvent"===t.type)return i.followUser(t);if("ForkApplyEvent"===t.type)return i.applyPatch(t);if("ForkEvent"===t.type)return i.forkRepository(t);if("GistEvent"===t.type&&"create"===t.payload.action)return i.createGist(t);if("GistEvent"===t.type&&"update"===t.payload.action)return i.updateGist(t);if("GollumEvent"===t.type)return i.editWiki(t);if("IssueCommentEvent"===t.type&&"issue"===a.issueType(t.payload.issue))return i.commentOnIssue(t);if("IssueCommentEvent"===t.type&&"pull request"===a.issueType(t.payload.issue))return i.commentOnPullRequest(t);if("IssuesEvent"===t.type&&"opened"===t.payload.action)return i.openIssue(t);if("IssuesEvent"===t.type&&"closed"===t.payload.action)return i.closeIssue(t);if("IssuesEvent"===t.type&&"reopened"===t.payload.action)return i.reopenIssue(t);if("MemberEvent"===t.type)return i.addUserToRepository(t);if("PublicEvent"===t.type)return i.openSourceRepository(t);if("PullRequestEvent"===t.type&&"opened"===t.payload.action)return i.openPullRequest(t);if("PullRequestEvent"===t.type&&"closed"===t.payload.action)return i.closePullRequest(t);if("PullRequestEvent"===t.type&&"reopened"===t.payload.action)return i.reopenPullRequest(t);if("PullRequestEvent"===t.type&&"synchronized"===t.payload.action)return i.synchronizePullRequest(t);if("PullRequestReviewCommentEvent"===t.type)return i.commentOnPullRequestDiff(t);if("PushEvent"===t.type)return i.pushToBranch(t);if("ReleaseEvent"===t.type)return i.createRelease(t);if("WatchEvent"===t.type)return i.starRepository(t)}};return{boilerplate:function(){return r("boilerplate")},profile:function(e){return r("profile",e)},event:function(e){return r("event",e)}}}();e.extend(r.prototype,{init:function(){this.container.append(o.boilerplate()),this.widgetHead=this.container.find(".activity-head"),this.widgetBody=this.container.find(".activity-body"),this.settings.debug&&console.log("Settings: ",this.settings),this.poll()},poll:function(){var t=this;t.fetchProfile().then(t.fetchActivity).always(function(){setTimeout(e.proxy(t.poll,t),1e3*t.realTimeout)})},fetchProfile:function(){var t,a;return t="https://api.github.com/users/"+this.settings.username,(a=e.ajax({url:t,headers:{Accept:"application/vnd.github.v3+json"},dataType:"json",ifModified:!0,context:this})).done(function(e,a,i){this.settings.debug&&console.log("Fetch "+t+" ("+i.status+" "+i.statusText+")"),e&&(this.settings.debug&&console.log(e),this.widgetHead.html(o.profile(e)))}),a.fail(function(e,a,i){this.settings.debug&&console.log("Fetch "+t+" ("+e.status+" "+e.statusText+")")}),a},fetchActivity:function(){var t,a,i;return t=this,a=new e.Deferred,(i=function(r){var l,n;l="https://api.github.com/users/"+t.settings.username+"/events/public",void 0===r&&(r=l),(n=e.ajax({url:r,headers:{Accept:"application/vnd.github.v3+json"},dataType:"json",ifModified:!0,context:t})).done(function(e,t,n){var s,u,d;if(this.settings.debug&&console.log("Fetch "+r+" ("+n.status+" "+n.statusText+")"),this.setRealTimeout(n.getResponseHeader("X-Poll-Interval")),e){for(this.settings.debug&&console.log(e),s="",d=0;d<e.length;d++)s+=o.event(e[d]);r===l?this.widgetBody.html("").append(s):this.widgetBody.append(s),(u=/<(\S+)>; rel="next"/.exec(n.getResponseHeader("Link")))?i(u[1]):a.resolve()}else a.resolve()}),n.fail(function(e,t,i){this.settings.debug&&console.log("Fetch "+r+" ("+e.status+" "+e.statusText+")"),this.setRealTimeout(e.getResponseHeader("X-Poll-Interval")),a.reject()})})(),a.promise()},setRealTimeout:function(e){this.realTimeout=this.settings.timeout,e>this.realTimeout&&(this.realTimeout=e)}}),e.fn.activity=function(t){return this.each(function(){e.data(this,"activity_plugin")||e.data(this,"activity_plugin",new r(this,t))}),this}}(jQuery,window,document);