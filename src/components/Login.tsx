import {useState} from 'react';
import {authorization} from '../api/greenApi';
import Button from './ui/Button';
import Input from './ui/Input';
import {clearCredentials, saveCredentials} from "@/storage/credentials.ts";

type LoginProps = {
    onSuccess: () => void;
};

function Login({onSuccess}: LoginProps) {
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        const id = idInstance.trim();
        const token = apiTokenInstance.trim();

        if (!id || !token) {
            setError('Заполните оба поля');
            return;
        }

        if (!/^\d{4,}$/.test(id)) {
            setError('Id должен состоять из цифр');
            return;
        }

        setLoading(true);
        setError('');

        try {
            saveCredentials({idInstance: id, apiTokenInstance: token});
            const state = await authorization();

            if (state !== 'authorized') {
                clearCredentials();
                setError('Инстанс не авторизован');
                return;
            }

            onSuccess();
        } catch {
            clearCredentials();
            setError('Неверные id или token');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login">
            <form className="login__card">
                <h1 className="login__title">Вход</h1>
                <label className="login__field">
                    <span>Id</span>
                    <Input value={idInstance} inputHandler={setIdInstance}/>
                </label>
                <label className="login__field">
                    <span>Token</span>
                    <Input value={apiTokenInstance} type="password" inputHandler={setApiTokenInstance}/>
                </label>
                {error ? <p className="login__error">{error}</p> : null}
                <Button onClick={handleSubmit} disabled={loading} block>
                    {loading ? 'Проверяем...' : 'Войти'}
                </Button>
            </form>
        </main>
    );
}

export default Login;
