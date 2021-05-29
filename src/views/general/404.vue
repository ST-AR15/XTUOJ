<template>
    <div class="not-found" id="not-found">
        <svg viewBox="0 0 1320 300">
            <!-- Symbol -->
            <symbol id="s-text">
                <text text-anchor="middle" x="50%" y="50%" dy=".35em">
                    404 NOT FOUND
                </text>
            </symbol>
            <!-- Duplicate symbols -->
            <use xlink:href="#s-text" class="text"></use>
            <use xlink:href="#s-text" class="text"></use>
            <use xlink:href="#s-text" class="text"></use>
        </svg>
        
    </div>
</template>

<script>
export default {
    methods: {
        back() {
            this.$router.push({ name: 'home' });
        }
    }
}
</script>

<style>
.not-found  {
height: 90vh;
background-size: .2em 100%;
font: 14.5em/1 Open Sans, Impact;
text-transform: uppercase;
margin: 0;
}
.not-found svg {
position: absolute;
width: 100%;
height: 100%;
}
.not-found .text {
fill: none;
stroke-width: 5;
stroke-dasharray: 0 300;
stroke-dashoffset: 0;
}

.not-found .text:nth-child(3n + 1) {
stroke: #FFFFFF;
animation: stroke 10s ease-in-out forwards;

}

.not-found .text:nth-child(3n + 2) {
stroke: #808080;
animation: stroke1 10s ease-in-out forwards;

}

.not-found .text:nth-child(3n + 3) {
stroke: #696969;
animation: stroke2 10s ease-in-out forwards;

}
</style>