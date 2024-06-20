const canvas = document.getElementById('puzzleCanvas');
const ctx = canvas.getContext('2d');
const uploadImage = document.getElementById('uploadImage');

const img = new Image();

uploadImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

img.onload = () => {
    const h = img.height;
    const w = img.width;
    canvas.width = w;
    canvas.height = h;

    const splitx = 3;
    const splity = 3;
    let counter = 0;

    const posx_list = [w / 6, w / 2, w * 5 / 6];
    const posy_list = [h / 6, h / 2, h * 5 / 6];

    const pos_available = [
        [100, 1, 0, 1, 0, 0, 0, 0, 0],
        [1, 100, 1, 0, 1, 0, 0, 0, 0],
        [0, 1, 100, 0, 0, 1, 0, 0, 0],
        [1, 0, 0, 100, 1, 0, 1, 0, 0],
        [0, 1, 0, 1, 100, 1, 0, 1, 0],
        [0, 0, 1, 0, 1, 100, 0, 0, 1],
        [0, 0, 0, 1, 0, 0, 100, 1, 0],
        [0, 0, 0, 0, 1, 0, 1, 100, 1],
        [0, 0, 0, 0, 0, 1, 0, 1, 100]
    ];

    let pic_list = [];
    let pos_list = [];
    let kkk = 0;

    function split_pic() {
        const cx = 0;
        const cy = 0;
        const pic_list = [];
        for (let j = 0; j < splitx; j++) {
            for (let i = 0; i < splity; i++) {
                const canvasPiece = document.createElement('canvas');
                canvasPiece.width = w / splitx;
                canvasPiece.height = h / splity;
                const ctxPiece = canvasPiece.getContext('2d');
                ctxPiece.drawImage(img, cx + j * (w / splitx), cy + i * (h / splity), w / splitx, h / splity, 0, 0, w / splitx, h / splity);
                pic_list.push(canvasPiece);
            }
        }
        return pic_list;
    }

    function pic_update(pic_list, pos_list) {
        ctx.clearRect(0, 0, w, h);
        for (let j = 0; j < splitx; j++) {
            for (let i = 0; i < splity; i++) {
                const ppp = splitx * j + i;
                if (pos_list[ppp] !== 100) {
                    ctx.drawImage(pic_list[pos_list[ppp]], j * (w / splitx), i * (h / splity));
                }
            }
        }
    }

    function pos_update(pos_index, pos_list, kkk) {
        if (pos_available[pos_list.indexOf(100)][pos_index] === 1) {
            pos_list[pos_list.indexOf(100)] = pos_list[pos_index];
            pos_list[pos_index] = 100;
            kkk++;
        }
        return [pos_list, kkk];
    }

    function play_puzzle(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const posx = posx_list.map(v => Math.abs(v - x)).indexOf(Math.min(...posx_list.map(v => Math.abs(v - x))));
        const posy = posy_list.map(v => Math.abs(v - y)).indexOf(Math.min(...posy_list.map(v => Math.abs(v - y))));
        const pos_index = posx * splitx + posy;

        if (counter === 0) {
            pos_list = [0, 1, 2, 3, 4, 5, 6, 7, 100];
            counter = 1;
            let kkk = 0;
            while (kkk < 100) {
                const randIndex = Math.floor(Math.random() * (splitx * splity));
                [pos_list, kkk] = pos_update(randIndex, pos_list, kkk);
            }
            pic_update(pic_list, pos_list);
        } else {
            [pos_list, kkk] = pos_update(pos_index, pos_list, kkk);
            pic_update(pic_list, pos_list);
            if (JSON.stringify(pos_list) === JSON.stringify([0, 1, 2, 3, 4, 5, 6, 7, 100])) {
                ctx.fillStyle = 'black';
                ctx.font = '48px sans-serif';
                // ctx.fillText('Complete!!', w / 2 - 150, h / 2 + 50);
                ctx.drawImage(img, 0, 0, w, h);
                counter = 0;
            }
        }
    }

    pic_list = split_pic();

    for (let j = 0; j < splitx; j++) {
        for (let i = 0; i < splity; i++) {
            const num = j * splitx + i;
            ctx.fillStyle = 'red';
            ctx.font = '24px sans-serif';
            ctx.fillText(num, j * (w / splitx) + 100, i * (h / splity) + 100);
        }
    }

    canvas.addEventListener('load', play_puzzle);
    ctx.drawImage(img, 0, 0, w, h);
};
