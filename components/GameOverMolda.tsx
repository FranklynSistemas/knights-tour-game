import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle } from "lucide-react";

type Props = {
    message: string | null;
    type: "win" | "fail";
    onClose: () => void;
}


export const GameOverModal = ({ message, type = "win", onClose }: Props) => {
    const isWin = type === "win";

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                >
                    <motion.div
                        className={`w-full max-w-md sm:max-w-sm rounded-xl p-6 text-center shadow-2xl border-2 ${isWin
                            ? "bg-green-700 border-green-400 text-green-100"
                            : "bg-red-700 border-red-400 text-red-100"
                            }`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <div className="flex justify-center mb-4">
                            {isWin ? (
                                <CheckCircle className="w-10 h-10 text-green-300" />
                            ) : (
                                <XCircle className="w-10 h-10 text-red-300" />
                            )}
                        </div>
                        <h2 className="text-xl font-bold leading-snug mb-4 break-words">{message}</h2>
                        <button
                            onClick={onClose}
                            className={`w-full sm:w-auto mt-2 px-6 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 transition-colors ${isWin
                                ? "bg-green-300 text-green-900 hover:bg-green-400 focus:ring-green-200"
                                : "bg-red-300 text-red-900 hover:bg-red-400 focus:ring-red-200"
                                }`}
                        >
                            Close
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};