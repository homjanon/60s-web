import {
	Copy,
	KeyRound,
	Languages,
	Palette,
	QrCode,
	RefreshCw,
	TerminalSquare,
	CalendarClock,
	Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
	type ColorPaletteResult,
	fetchApi,
	type PasswordResult,
	type QrCodeResult,
	type TranslationResult,
	unwrap,
} from "../api";
import { API_REPO_URL, toolDefinitions } from "../config";
import type { ApiState, ToolId } from "../types";
import { CardTitle, Status } from "./ui";

export function ToolWorkspace({
	apiBase,
	activeTool,
}: {
	apiBase: string;
	activeTool: ToolId;
}) {
	const orderedTools = [
		activeTool,
		...toolDefinitions
			.map((tool) => tool.id)
			.filter((toolId) => toolId !== activeTool),
	] as ToolId[];

	return (
		<div className="tool-workspace tool-workspace-grid">
			{orderedTools.map((toolId) => {
				if (toolId === "translate") {
					return (
						<div
							key={toolId}
							className={`tool-panel-wrap ${toolId === activeTool ? "featured" : ""}`}
						>
							<TranslateTool apiBase={apiBase} />
						</div>
					);
				}
				if (toolId === "qrcode") {
					return (
						<div
							key={toolId}
							className={`tool-panel-wrap ${toolId === activeTool ? "featured" : ""}`}
						>
							<QrcodeTool apiBase={apiBase} />
						</div>
					);
				}
				if (toolId === "password") {
					return (
						<div
							key={toolId}
							className={`tool-panel-wrap ${toolId === activeTool ? "featured" : ""}`}
						>
							<PasswordTool apiBase={apiBase} />
						</div>
					);
				}
				if (toolId === "kfc") {
					return (
						<div
							key={toolId}
							className={`tool-panel-wrap ${toolId === activeTool ? "featured" : ""}`}
						>
							<KfcTool apiBase={apiBase} />
						</div>
					);
				}
				if (toolId === "ip") {
					return (
						<div
							key={toolId}
							className={`tool-panel-wrap ${toolId === activeTool ? "featured" : ""}`}
						>
							<IpTool apiBase={apiBase} />
						</div>
					);
				}
				if (toolId === "lunar") {
					return (
						<div
							key={toolId}
							className={`tool-panel-wrap ${toolId === activeTool ? "featured" : ""}`}
						>
							<LunarTool apiBase={apiBase} />
						</div>
					);
				}
				return (
					<div
						key={toolId}
						className={`tool-panel-wrap ${toolId === activeTool ? "featured" : ""}`}
					>
						<PaletteTool apiBase={apiBase} />
					</div>
				);
			})}
		</div>
	);
}

function TranslateTool({ apiBase }: { apiBase: string }) {
	const [text, setText] = useState("你好，世界");
	const [target, setTarget] = useState("en");
	const [result, setResult] = useState<ApiState<TranslationResult>>({
		loading: false,
	});
	const hasApiBase = Boolean(apiBase.trim());

	const run = useCallback(async () => {
		if (!hasApiBase) {
			setResult({ loading: false });
			return;
		}
		setResult({ loading: true });
		try {
			const payload = await fetchApi<TranslationResult>(apiBase, "/fanyi", {
				text,
				from: "auto",
				to: target,
			});
			setResult({
				loading: false,
				data: unwrap(payload),
				updatedAt: new Date(),
			});
		} catch (error) {
			setResult({
				loading: false,
				error: error instanceof Error ? error.message : "请求失败",
			});
		}
	}, [apiBase, hasApiBase, target, text]);

	useEffect(() => {
		void run();
	}, [run]);

	return (
		<article className="card tool-panel">
			<CardTitle
				icon={<Languages size={20} />}
				title="在线翻译"
				right={<Status state={result} />}
			/>
			<div className="tool-panel-body">
				<div className="tool-form two-columns">
					<label>
						<span>待翻译内容</span>
						<input
							value={text}
							onChange={(event) => setText(event.target.value)}
						/>
					</label>
					<label>
						<span>目标语言</span>
						<input
							value={target}
							onChange={(event) => setTarget(event.target.value)}
							placeholder="如 en / ja / ko"
						/>
					</label>
				</div>
				<div className="tool-actions">
					<button
						type="button"
						className="primary-subtle"
						onClick={() => void run()}
						disabled={!hasApiBase}
					>
						<RefreshCw size={16} /> 重新翻译
					</button>
				</div>
				<div className="tool-result-grid">
					<div className="tool-result-card">
						<small>源文本</small>
						<b>{result.data?.source?.text || text}</b>
						<em>{result.data?.source?.type_desc || "自动检测"}</em>
					</div>
					<div className="tool-result-card">
						<small>翻译结果</small>
						<b>{result.data?.target?.text || "--"}</b>
						<em>{result.data?.target?.type_desc || "目标语言"}</em>
					</div>
				</div>
			</div>
		</article>
	);
}

function QrcodeTool({ apiBase }: { apiBase: string }) {
	const [text, setText] = useState(API_REPO_URL);
	const [result, setResult] = useState<ApiState<QrCodeResult>>({
		loading: false,
	});
	const hasApiBase = Boolean(apiBase.trim());

	const run = useCallback(async () => {
		if (!hasApiBase) {
			setResult({ loading: false });
			return;
		}
		setResult({ loading: true });
		try {
			const payload = await fetchApi<QrCodeResult>(apiBase, "/qrcode", {
				text,
				size: "256",
				encoding: "json",
			});
			setResult({
				loading: false,
				data: unwrap(payload),
				updatedAt: new Date(),
			});
		} catch (error) {
			setResult({
				loading: false,
				error: error instanceof Error ? error.message : "请求失败",
			});
		}
	}, [apiBase, hasApiBase, text]);

	useEffect(() => {
		void run();
	}, [run]);

	return (
		<article className="card tool-panel">
			<CardTitle
				icon={<QrCode size={20} />}
				title="二维码生成"
				right={<Status state={result} />}
			/>
			<div className="tool-panel-body">
				<div className="tool-form">
					<label>
						<span>二维码内容</span>
						<input
							value={text}
							onChange={(event) => setText(event.target.value)}
						/>
					</label>
				</div>
				<div className="tool-actions">
					<button
						type="button"
						className="primary-subtle"
						onClick={() => void run()}
						disabled={!hasApiBase}
					>
						<RefreshCw size={16} /> 重新生成
					</button>
				</div>
				<div className="qr-preview">
					{result.data?.data_uri ? (
						<img src={result.data.data_uri} alt="二维码预览" />
					) : (
						<div className="tool-empty">暂无二维码预览</div>
					)}
					<div className="tool-result-card">
						<small>编码内容</small>
						<b>{result.data?.text || text}</b>
						<em>{result.data?.mime_type || "image/png"}</em>
					</div>
				</div>
			</div>
		</article>
	);
}

function PasswordTool({ apiBase }: { apiBase: string }) {
	const [length, setLength] = useState("18");
	const [symbols, setSymbols] = useState(true);
	const [result, setResult] = useState<ApiState<PasswordResult>>({
		loading: false,
	});
	const hasApiBase = Boolean(apiBase.trim());

	const run = useCallback(async () => {
		if (!hasApiBase) {
			setResult({ loading: false });
			return;
		}
		setResult({ loading: true });
		try {
			const payload = await fetchApi<PasswordResult>(apiBase, "/password", {
				length,
				symbols: String(symbols),
			});
			setResult({
				loading: false,
				data: unwrap(payload),
				updatedAt: new Date(),
			});
		} catch (error) {
			setResult({
				loading: false,
				error: error instanceof Error ? error.message : "请求失败",
			});
		}
	}, [apiBase, hasApiBase, length, symbols]);

	useEffect(() => {
		void run();
	}, [run]);

	return (
		<article className="card tool-panel">
			<CardTitle
				icon={<KeyRound size={20} />}
				title="密码生成器"
				right={<Status state={result} />}
			/>
			<div className="tool-panel-body">
				<div className="tool-form two-columns">
					<label>
						<span>长度</span>
						<input
							value={length}
							onChange={(event) => setLength(event.target.value)}
							placeholder="18"
						/>
					</label>
					<label className="tool-checkbox">
						<span>包含符号</span>
						<input
							type="checkbox"
							checked={symbols}
							onChange={(event) => setSymbols(event.target.checked)}
						/>
					</label>
				</div>
				<div className="tool-actions">
					<button
						type="button"
						className="primary-subtle"
						onClick={() => void run()}
						disabled={!hasApiBase}
					>
						<RefreshCw size={16} /> 再生成一个
					</button>
					<button
						type="button"
						className="outline-button"
						onClick={() =>
							navigator.clipboard?.writeText(result.data?.password || "")
						}
					>
						<Copy size={16} /> 复制密码
					</button>
				</div>
				<div className="tool-result-card highlight">
					<small>生成结果</small>
					<b>{result.data?.password || "--"}</b>
					<em>
						{result.data?.generation_info?.strength || "强度未知"} ·{" "}
						{result.data?.generation_info?.time_to_crack || "待评估"}
					</em>
				</div>
			</div>
		</article>
	);
}

function PaletteTool({ apiBase }: { apiBase: string }) {
	const [color, setColor] = useState("#0f9b8e");
	const [result, setResult] = useState<ApiState<ColorPaletteResult>>({
		loading: false,
	});
	const hasApiBase = Boolean(apiBase.trim());

	const run = useCallback(async () => {
		if (!hasApiBase) {
			setResult({ loading: false });
			return;
		}
		setResult({ loading: true });
		try {
			const payload = await fetchApi<ColorPaletteResult>(
				apiBase,
				"/color/palette",
				{ color },
			);
			setResult({
				loading: false,
				data: unwrap(payload),
				updatedAt: new Date(),
			});
		} catch (error) {
			setResult({
				loading: false,
				error: error instanceof Error ? error.message : "请求失败",
			});
		}
	}, [apiBase, color, hasApiBase]);

	useEffect(() => {
		void run();
	}, [run]);

	return (
		<article className="card tool-panel">
			<CardTitle
				icon={<Palette size={20} />}
				title="配色方案"
				right={<Status state={result} />}
			/>
			<div className="tool-panel-body">
				<div className="tool-form two-columns">
					<label>
						<span>基准颜色</span>
						<input
							value={color}
							onChange={(event) => setColor(event.target.value)}
						/>
					</label>
					<label>
						<span>颜色面板</span>
						<input
							type="color"
							value={color}
							onChange={(event) => setColor(event.target.value)}
						/>
					</label>
				</div>
				<div className="tool-actions">
					<button
						type="button"
						className="primary-subtle"
						onClick={() => void run()}
						disabled={!hasApiBase}
					>
						<RefreshCw size={16} /> 重新生成
					</button>
				</div>
				<div className="palette-groups">
					{(result.data?.palettes || []).slice(0, 3).map((palette) => (
						<div className="palette-group" key={palette.name}>
							<div className="mini-heading">
								<b>{palette.name}</b>
								<small>{palette.description}</small>
							</div>
							<div className="palette-row">
								{(palette.colors || []).map((item) => (
									<div
										className="palette-chip"
										key={`${palette.name}-${item.hex}`}
									>
										<i style={{ background: item.hex }} />
										<span>{item.hex}</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</article>
	);
}

function KfcTool({ apiBase }: { apiBase: string }) {
	const [result, setResult] = useState<ApiState<{ kfc?: string }>>({
		loading: false,
	});
	const hasApiBase = Boolean(apiBase.trim());

	const run = useCallback(async () => {
		if (!hasApiBase) {
			setResult({ loading: false });
			return;
		}
		setResult({ loading: true });
		try {
			const payload = await fetchApi<{ kfc?: string }>(apiBase, "/kfc", {});
			setResult({
				loading: false,
				data: unwrap(payload),
				updatedAt: new Date(),
			});
		} catch (error) {
			setResult({
				loading: false,
				error: error instanceof Error ? error.message : "请求失败",
			});
		}
	}, [apiBase, hasApiBase]);

	useEffect(() => {
		void run();
	}, [run]);

	return (
		<article className="card tool-panel">
			<CardTitle
				icon={<Sparkles size={20} />}
				title="疯狂星期四文案"
				right={<Status state={result} />}
			/>
			<div className="tool-panel-body">
				<div className="tool-result-card highlight">
					<small>今日文案</small>
					<b>{result.data?.kfc || (result.loading ? "正在读取..." : "--")}</b>
				</div>
				<div className="tool-actions">
					<button
						type="button"
						className="primary-subtle"
						onClick={() => void run()}
						disabled={!hasApiBase}
					>
						<RefreshCw size={16} /> 换一句
					</button>
					<button
						type="button"
						className="outline-button"
						onClick={() => navigator.clipboard?.writeText(result.data?.kfc || "")}
					>
						<Copy size={16} /> 复制文案
					</button>
				</div>
			</div>
		</article>
	);
}

function IpTool({ apiBase }: { apiBase: string }) {
	type IpResult = {
		ip?: string;
		country?: string;
		prov?: string;
		city?: string;
		timezone?: string;
		isp?: string;
	};
	const [result, setResult] = useState<ApiState<IpResult>>({ loading: false });
	const hasApiBase = Boolean(apiBase.trim());

	const run = useCallback(async () => {
		if (!hasApiBase) {
			setResult({ loading: false });
			return;
		}
		setResult({ loading: true });
		try {
			const payload = await fetchApi<IpResult>(apiBase, "/ip", {});
			setResult({
				loading: false,
				data: unwrap(payload),
				updatedAt: new Date(),
			});
		} catch (error) {
			setResult({
				loading: false,
				error: error instanceof Error ? error.message : "请求失败",
			});
		}
	}, [apiBase, hasApiBase]);

	useEffect(() => {
		void run();
	}, [run]);

	const location = [result.data?.country, result.data?.prov, result.data?.city]
		.filter(Boolean)
		.join(" ");

	return (
		<article className="card tool-panel">
			<CardTitle
				icon={<TerminalSquare size={20} />}
				title="公网 IP"
				right={<Status state={result} />}
			/>
			<div className="tool-panel-body">
				<div className="tool-result-grid">
					<div className="tool-result-card highlight">
						<small>IP 地址</small>
						<b>{result.data?.ip || "--"}</b>
						<em>{result.data?.isp || ""}</em>
					</div>
					<div className="tool-result-card">
						<small>归属地</small>
						<b>{location || "--"}</b>
						<em>{result.data?.timezone || ""}</em>
					</div>
				</div>
				<div className="tool-actions">
					<button
						type="button"
						className="primary-subtle"
						onClick={() => void run()}
						disabled={!hasApiBase}
					>
						<RefreshCw size={16} /> 重新查询
					</button>
					<button
						type="button"
						className="outline-button"
						onClick={() => navigator.clipboard?.writeText(result.data?.ip || "")}
					>
						<Copy size={16} /> 复制 IP
					</button>
				</div>
			</div>
		</article>
	);
}

function LunarTool({ apiBase }: { apiBase: string }) {
	type LunarResult = {
		solar?: {
			full?: string;
			week_desc?: string;
			season_name?: string;
		};
		lunar?: {
			desc_short?: string;
			year_desc?: string;
			month_desc?: string;
			day_desc?: string;
		};
		stats?: {
			day_of_year?: number;
			percents_formatted?: {
				year?: string;
				month?: string;
			};
		};
		term?: {
			today?: string | null;
			stage?: { name?: string } | null;
		};
		zodiac?: { year?: string };
	};
	const [result, setResult] = useState<ApiState<LunarResult>>({ loading: false });
	const hasApiBase = Boolean(apiBase.trim());

	const run = useCallback(async () => {
		if (!hasApiBase) {
			setResult({ loading: false });
			return;
		}
		setResult({ loading: true });
		try {
			const payload = await fetchApi<LunarResult>(apiBase, "/lunar", {});
			setResult({
				loading: false,
				data: unwrap(payload),
				updatedAt: new Date(),
			});
		} catch (error) {
			setResult({
				loading: false,
				error: error instanceof Error ? error.message : "请求失败",
			});
		}
	}, [apiBase, hasApiBase]);

	useEffect(() => {
		void run();
	}, [run]);

	const lunarFull = result.data?.lunar?.desc_short || "--";
	const termText =
		result.data?.term?.today ||
		(result.data?.term?.stage?.name
			? `${result.data.term.stage.name}进行中`
			: "");

	return (
		<article className="card tool-panel">
			<CardTitle
				icon={<CalendarClock size={20} />}
				title="农历信息"
				right={<Status state={result} />}
			/>
			<div className="tool-panel-body">
				<div className="tool-result-grid">
					<div className="tool-result-card highlight">
						<small>农历</small>
						<b>{lunarFull}</b>
						<em>{result.data?.zodiac?.year || ""}</em>
					</div>
					<div className="tool-result-card">
						<small>公历</small>
						<b>
							{result.data?.solar?.full || "--"}{" "}
							{result.data?.solar?.week_desc || ""}
						</b>
						<em>{termText}</em>
					</div>
				</div>
				<div className="tool-result-grid">
					<div className="tool-result-card">
						<small>今年第几天</small>
						<b>第 {result.data?.stats?.day_of_year ?? "--"} 天</b>
						<em>年度已过 {result.data?.stats?.percents_formatted?.year || "--"}</em>
					</div>
				</div>
				<div className="tool-actions">
					<button
						type="button"
						className="primary-subtle"
						onClick={() => void run()}
						disabled={!hasApiBase}
					>
						<RefreshCw size={16} /> 刷新
					</button>
				</div>
			</div>
		</article>
	);
}
