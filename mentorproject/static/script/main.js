document.addEventListener('DOMContentLoaded', () => {
    // ======= モーダル関連の機能 =======
    function openModal(element) {
        element.classList.add('is-active');
    }

    function closeModal(element) {
        element.classList.remove('is-active');
    }

    function closeAllModals() {
        document.querySelectorAll('.modal').forEach((modal) => {
            closeModal(modal);
        });
    }

    // モーダルトリガーにクリックイベントを設定
    document.querySelectorAll('.js-modal-trigger').forEach((trigger) => {
        const modalId = trigger.dataset.target;
        const targetModal = document.getElementById(modalId);

        if (targetModal) {
            trigger.addEventListener('click', () => {
                openModal(targetModal);
            });
        }
    });

    // モーダルを閉じる要素にクリックイベントを設定
    document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button').forEach((closeElement) => {
        const targetModal = closeElement.closest('.modal');

        if (targetModal) {
            closeElement.addEventListener('click', () => {
                closeModal(targetModal);
            });
        }
    });

    // Escキーでモーダルを閉じるイベントを設定
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            closeAllModals();
        }
    });

    // ======= クイズ関連の機能 =======
    // クイズ関連の変数
    let lenght = 0;
    let count = 0;
    let ans = '';
    let descriptions = '';
    let total_counts = '';
    const progressElement = document.getElementById('progress');

    // 問題出力回数を設定
    function set_total_count(value) {
        total_counts = value;
        console.log(total_counts);
    }

    // 答えが合ってるかを判定＆ボタンを表示非表示する＆正解　不正解画像を表示
    function check(ansvalue) {
        console.log(ans);
        
        // UI要素の表示状態を更新
        document.getElementById('yes').style.display = 'none';
        document.getElementById('no').style.display = 'none';
        document.getElementById('fbutton').style.gap = '0px';
        document.getElementById('description').style.display = '';
        document.getElementById('descriptionsfield').textContent = descriptions;
        document.getElementById('answeris').style.display = '';
        
        // 〇×表示の制御
        if (ansvalue === 'o') {
            document.getElementById('correct').style.display = '';
        } else {
            document.getElementById('wrong').style.display = '';
        }
        
        // 正解/不正解の表示
        if (ans === ansvalue) {
            document.getElementById('answeris').textContent = '正解';
            document.getElementById('answeris').style.color = 'green';
        } else {
            document.getElementById('answeris').textContent = '不正解';
            document.getElementById('answeris').style.color = '#ca1313';
        }
    }

    // クイズボックスにクリックイベントを設定
    document.querySelectorAll('.js-modal-trigger.box').forEach(button => {
        button.addEventListener('click', function() {
            const title = this.textContent;
            console.log(title);
            
            count++;
            document.getElementById('count').textContent = count;
            document.getElementById('imgesfield-img').src = '';
            document.getElementById('answeris').style.display = 'none';
            document.getElementById('correct').style.display = 'none';
            document.getElementById('wrong').style.display = 'none';
            document.getElementById('yes').style.display = '';
            document.getElementById('no').style.display = '';
            document.getElementById('description').style.display = 'none';
            
            fetch('/main/question_box/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    thistitle: title, 
                    count: count,
                    total_counts: total_counts
                })
            })
            .then(response => response.json())
            .then(data => {
                // エンドフラグ処理
                if (data.end) {
                    location.reload();
                    return;
                }
                
                // エラー処理
                if (data.error) {
                    console.error('Error:', data.error);
                    return;
                }
                
                // データ処理
                console.log(data);
                
                // 変数を更新
                ans = data.answers;
                descriptions = data.descriptions;
                console.log(data.answers);
                
                // UI要素を更新
                document.getElementById('questionsfiled').textContent = data.questions;
                document.getElementById('modal-title').textContent = data.name;
                
                if (data.images_path) {
                    document.getElementById('imgesfield').src = data.images_path;
                    console.log(data.images_path);
                }
                
                // プログレスバーを更新
                let progress = document.getElementById('progress');
                progress.value = count;
                progress.max = total_counts;
                
            })
            .catch(error => console.error('Error:', error));
        });
    });

    // 次の問題ボタンのイベントリスナー
    document.getElementById('next').addEventListener('click', function() {
        const title = document.getElementById('modal-title').textContent.trim();
        
        count++;
        document.getElementById('fbutton').style.gap = '';
        document.getElementById('imgesfield-img').src = '';
        document.getElementById('yes').style.display = '';
        document.getElementById('no').style.display = '';
        document.getElementById('answeris').style.display = 'none';
        document.getElementById('correct').style.display = 'none';
        document.getElementById('wrong').style.display = 'none';
        document.getElementById('description').style.display = 'none';
        document.getElementById('descriptionsfield').textContent = '';
        
        fetch('/main/question_box/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                thistitle: title, 
                count: count,
                total_counts: total_counts
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.end) {
                document.getElementById('modal-title').textContent = data.name;
                location.reload();
            }
            if (data.error) {
                console.error('Error:', data.error);
            } else {
                console.log(data);
                document.getElementById('questionsfiled').textContent = data.questions;
                document.getElementById('modal-title').textContent = data.name;
                document.getElementById('count').textContent = count;
                document.getElementById('progress').value = count;
                ans = data.answers;
                descriptions = data.descriptions;
                if (data.images_path) {
                    document.getElementById('imgesfield-img').src = data.images_path;
                }
                progress = document.getElementById('progress');
                progress.value = count;
                progress.max = total_counts;
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // グローバル関数の公開
    window.check = check;
    window.set_total_count = set_total_count;
});