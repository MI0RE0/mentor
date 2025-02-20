document.addEventListener('DOMContentLoaded', () => {
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);


        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });
});
const progressElement = document.getElementById('progress');


let lenght = 0;
let count = 0;
let ans = '';
let descriptions = '';
let total_counts = '';
//問題出力回数を設定
function set_total_count(value){
    
    total_counts = value;
    console.log(total_counts)
}
//最初はlistidが二個目以降のタイトルを取得できないためquerySelectorでclassを特定してからtitleを取得
document.querySelectorAll('.js-modal-trigger.box').forEach(button => {
    button.addEventListener('click', function () {
        let title = this.textContent;
        console.log(title);
        count++;
        document.getElementById('imgesfield-img').src = '';
        //document.getElementById('back').style.display = count > 1 ? '' : 'none';
        document.getElementById('answeris').style.display = 'none';
        document.getElementById('correct').style.display = 'none';
        document.getElementById('wrong').style.display = 'none';
        document.getElementById('yes').style.display = '';
        document.getElementById('no').style.display = '';
        document.getElementById('description').style.display = 'none';
        document.getElementById('count').textContent = count
        fetch('/main/question_box/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ thistitle: title, count: count,total_counts: total_counts,})
        })
            .then(response => response.json())
            .then(data => {
                if (data.end){
                    location.reload()
                }
                if (data.error) {
                    console.error('Error:', data.error);
                } else {
                    console.log(data);
                    document.getElementById('questionsfiled').textContent = data.questions;
                    document.getElementById('modal-title').textContent = data.name;
                    console.log(data.answers);
                    ans = data.answers;
                    if (data.images_path) {
                        document.getElementById('imgesfield').src = data.images_path;
                    }
                    descriptions = data.descriptions;
                    let progress = document.getElementById('progress');
                    progress.value = count;
                    progress.max = total_counts;

                }
            })
            .catch(error => console.error('Error:', error));
    });
});


//モダルが開いて1回目以降の質問を出す

document.getElementById('next').addEventListener('click', function (event) {
    document.getElementById('fbutton').style.gap = ''
    const title = document.getElementById('modal-title').textContent.trim()
    document.getElementById('imgesfield-img').src = '';
    document.getElementById('yes').style.display = '';
    document.getElementById('no').style.display = '';
    //document.getElementById('back').style.display = '';
    document.getElementById('answeris').style.display = 'none';
    document.getElementById('correct').style.display = 'none';
    document.getElementById('wrong').style.display = 'none';
    document.getElementById('description').style.display = 'none';
    document.getElementById('descriptionsfield').textContent = '';
    count++;
    fetch('/main/question_box/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // JSON を送信
        },
        body: JSON.stringify({ thistitle: title, count: count,total_counts: total_counts,}) // データを JSON 化
    })
        .then(response => response.json())
        .then(data => {
            if (data.end) {
                document.getElementById('modal-title').textContent = data.name
                location.reload()
            }
            if (data.error) {
                console.error('Error:', data.error);

            } else {
                console.log(data);
                document.getElementById('questionsfiled').textContent = data.questions;
                document.getElementById('modal-title').textContent = data.name
                document.getElementById('count').textContent = count
                document.getElementById('progress').value = count;
                ans = data.answers;
                descriptions = data.descriptions;
                if (data.images_path) {
                    document.getElementById('imgesfield-img').src = data.images_path;
                }
                progress = document.getElementById('progress');
                progress.value = count
                progress.max = total_counts
            }
        })
        .catch(error => console.error('Error:', error));

});

//backをクリックしたときcountを減らして前の質問に戻る
/*document.getElementById('back').addEventListener('click', function (event) {
    const title = document.getElementById('modal-title').textContent.trim()
    document.getElementById('imgesfield-img').src = '';
    document.getElementById('fbutton').style.gap = ''
    document.getElementById('yes').style.display = '';
    document.getElementById('no').style.display = '';
    document.getElementById('correct').style.display = 'none';
    document.getElementById('wrong').style.display = 'none';
    document.getElementById('answeris').style.display = 'none';
    document.getElementById('description').style.display = 'none';
    document.getElementById('descriptionsfield').textContent = '';
    count--;
    if (count <= 1) {
        document.getElementById('back').style.display = 'none';
    }
    fetch('/main/question_box/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // JSON を送信
        },
        body: JSON.stringify({ thistitle: title, count: count }) // データを JSON 化
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                console.log(data);
                document.getElementById('questionsfiled').textContent = data.questions;
                document.getElementById('modal-title').textContent = data.name
                document.getElementById('count').textContent = count
                progress = document.getElementById('progress');
                ans = data.answers;
                if (data.images_path) {
                    document.getElementById('imgesfield').src = data.images_path;
                }

                descriptions = data.descriptions;
                progress.value = count
                progress.max = data.lenght

            }
        })
        .catch(error => console.error('Error:', error));

});
*/


//答えが合ってるかを判定＆ボタンを表示非表示する＆正解　不正解画像を表示
function check(ansvalue) {
    console.log(ans);
    document.getElementById('yes').style.display = 'none';
    document.getElementById('no').style.display = 'none';
    /*if (count <= 1) {
        document.getElementById('back').style.display = 'none';
    } else {
        document.getElementById('back').style.display = '';
    }*/
    document.getElementById('fbutton').style.gap = '0px'
    if (ansvalue === 'o') {
        document.getElementById('correct').style.display = '';
    } else {
        document.getElementById('wrong').style.display = '';
    }
    document.getElementById('description').style.display = '';

    if (ans === ansvalue) {
        document.getElementById('descriptionsfield').textContent = descriptions;
        document.getElementById('answeris').style.display = '';
        document.getElementById('answeris').textContent = '正解'
        document.getElementById('answeris').style.color = 'green';
    } else {
        document.getElementById('descriptionsfield').textContent = descriptions;
        document.getElementById('answeris').style.display = '';
        document.getElementById('answeris').textContent = '不正解'
        document.getElementById('answeris').style.color = '#ca1313';
    }
}
document.querySelectorAll('.js-modal-trigger').forEach(button => {
    button.addEventListener('click', function (event) {
        title = event.target.textContent;

    });
});