<template>
    <div class="editor" id="editor">
        <div style="width: 1450px">
            <div id="editormdd">
                <textarea style="display:none"></textarea>
            </div>
        </div>
    </div>
</template>

<script>
// import $ from 'jquery';
// import editormd from 'editor.md'
// import "jquery"
// import "../../public/lib/editormd/editormd.min.js"
import scriptjs from 'scriptjs'

export default {
    props: {
        id: String
    },
    mounted() {
        Promise.all([
            scriptjs('@/../public/lib/jquery/jquery.min.js'),
            scriptjs('../../../../../lib/editormd/editormd.min.js'),
        ]).then(() => {
            // let testEditor;
            // $(function() {
            //     testEditor = editormd("test-editormd", {
            //         width   : "100%",
            //         height  : 640,
            //         syncScrolling : "single",
            //         path    : "editormd/lib/",
			// 		tex: true,
			// 		htmlDecode : "b,i,div,span,br,a,img,area,strong,h1,h2,h3,h4,h5,h6"  // Filter tags, and all on* attributes
            //     });
            // });
            // console.log(window.$);
        })
    }
}
</script>

<style>

</style>