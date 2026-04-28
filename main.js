async function translate(text, from, to, options = {}) {
    const { config, utils } = options;
    const { tauriFetch: fetch } = utils;

    const { apiUrl = ""} = config;

    if (!apiUrl) {
        console.error("配置不完整，请检查 pot 插件设置");
        return false;
    }

    let baseUrl = apiUrl.trim();
    if (!baseUrl.endsWith('/')) baseUrl += '/';

    let selectedDicts = [];
    if (config.enable_daijirin === "1") selectedDicts.push("daijirin");
    if (config.enable_meikyou === "1") selectedDicts.push("meikyou");
    if (config.enable_daijisen === "1") selectedDicts.push("daijisen");
    if (config.enable_kojien === "1") selectedDicts.push("kojien");

    if (selectedDicts.length === 0) {
        selectedDicts.push("daijirin");
    }

    const dictsParam = selectedDicts.join(",");

    try {
        const res = await fetch(`${baseUrl}search?q=${encodeURIComponent(text)}&dicts=${dictsParam}`);
        console.log("本地词典服务响应:", res);
        if (res.status >= 400) {
            throw `Http Request Error\nHttp Status: ${res.status}`;
        }
        // 恢复为直接返回后端对象
        return res.data;
    } catch (error) {
        console.error("本地词典服务请求失败:", error);
        return "本地服务异常，请检查 Docker 容器是否运行正常。"; // 报错也直接返回纯字符串
    }
}