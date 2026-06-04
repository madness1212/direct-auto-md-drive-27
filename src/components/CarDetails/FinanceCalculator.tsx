import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp, Wallet, Calendar as CalendarIcon } from "lucide-react";

// Rata dobânzii anuale (DAE) orientativă - poate fi modificată ulterior
const ANNUAL_INTEREST_RATE = 0.11;

const CAR_VALUE_MIN = 2000;
const CAR_VALUE_MAX = 50000;
const DOWN_PAYMENT_MIN = 0;
const DOWN_PAYMENT_MAX = 50;
const TERM_MIN = 6;
const TERM_MAX = 60;

interface FinanceCalculatorProps {
  carPrice: number;
  carTitle: string;
  carId: string;
}

const formatEUR = (value: number) =>
  new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(Math.round(value));

const FinanceCalculator = ({ carPrice, carTitle, carId }: FinanceCalculatorProps) => {
  const initialPrice = Math.min(Math.max(carPrice || CAR_VALUE_MIN, CAR_VALUE_MIN), CAR_VALUE_MAX);

  const [carValue, setCarValue] = useState<number>(initialPrice);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(initialPrice > 30000 ? 5 : 0);
  const [termMonths, setTermMonths] = useState<number>(60);

  useEffect(() => {
    const newPrice = Math.min(Math.max(carPrice || CAR_VALUE_MIN, CAR_VALUE_MIN), CAR_VALUE_MAX);
    setCarValue(newPrice);
    setDownPaymentPct(newPrice > 30000 ? 5 : 0);
  }, [carPrice]);

  const downPaymentEUR = useMemo(() => (carValue * downPaymentPct) / 100, [carValue, downPaymentPct]);
  const financedAmount = useMemo(() => Math.max(carValue - downPaymentEUR, 0), [carValue, downPaymentEUR]);

  const monthlyPayment = useMemo(() => {
    if (financedAmount <= 0 || termMonths <= 0) return 0;
    const r = ANNUAL_INTEREST_RATE / 12;
    if (r === 0) return financedAmount / termMonths;
    return (financedAmount * r) / (1 - Math.pow(1 + r, -termMonths));
  }, [financedAmount, termMonths]);

  const totalPayment = useMemo(
    () => monthlyPayment * termMonths + downPaymentEUR,
    [monthlyPayment, termMonths, downPaymentEUR]
  );

  const clamp = (v: number, min: number, max: number) =>
    isNaN(v) ? min : Math.min(Math.max(v, min), max);


  return (
    <Card className="border-auto-green/20 shadow-card overflow-hidden">
      <div className="bg-gradient-primary px-6 py-4 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Calculator Microfinanțare Auto</h3>
          <p className="text-sm text-white/80">Estimează rata lunară în timp real</p>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sliders */}
          <div className="lg:col-span-3 space-y-6">
            {/* Car Value */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-auto-green" />
                  Valoarea mașinii
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={carValue}
                    onChange={(e) =>
                      setCarValue(clamp(parseFloat(e.target.value), CAR_VALUE_MIN, CAR_VALUE_MAX))
                    }
                    className="w-28 h-9 text-right font-semibold"
                    min={CAR_VALUE_MIN}
                    max={CAR_VALUE_MAX}
                  />
                  <span className="text-sm font-semibold text-auto-green">EUR</span>
                </div>
              </div>
              <Slider
                value={[carValue]}
                min={CAR_VALUE_MIN}
                max={CAR_VALUE_MAX}
                step={100}
                onValueChange={(v) => setCarValue(v[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatEUR(CAR_VALUE_MIN)} €</span>
                <span>{formatEUR(CAR_VALUE_MAX)} €</span>
              </div>
            </div>

            {/* Down Payment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-auto-green" />
                  Avans propriu
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatEUR(downPaymentEUR)} €
                  </span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={downPaymentPct}
                      onChange={(e) =>
                        setDownPaymentPct(
                          clamp(parseFloat(e.target.value), DOWN_PAYMENT_MIN, DOWN_PAYMENT_MAX)
                        )
                      }
                      className="w-20 h-9 text-right font-semibold"
                      min={DOWN_PAYMENT_MIN}
                      max={DOWN_PAYMENT_MAX}
                    />
                    <span className="text-sm font-semibold text-auto-green">%</span>
                  </div>
                </div>
              </div>
              <Slider
                value={[downPaymentPct]}
                min={DOWN_PAYMENT_MIN}
                max={DOWN_PAYMENT_MAX}
                step={1}
                onValueChange={(v) => setDownPaymentPct(v[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{DOWN_PAYMENT_MIN}%</span>
                <span>{DOWN_PAYMENT_MAX}%</span>
              </div>
            </div>

            {/* Term */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-auto-green" />
                  Perioada de rambursare
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={termMonths}
                    onChange={(e) =>
                      setTermMonths(clamp(parseInt(e.target.value), TERM_MIN, TERM_MAX))
                    }
                    className="w-20 h-9 text-right font-semibold"
                    min={TERM_MIN}
                    max={TERM_MAX}
                  />
                  <span className="text-sm font-semibold text-auto-green">luni</span>
                </div>
              </div>
              <Slider
                value={[termMonths]}
                min={TERM_MIN}
                max={TERM_MAX}
                step={1}
                onValueChange={(v) => setTermMonths(v[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{TERM_MIN} luni</span>
                <span>{TERM_MAX} luni</span>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-primary rounded-xl p-5 text-white flex flex-col gap-4">
              <div>
                <p className="text-sm text-white/80 mb-1">Rata lunară estimată</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{formatEUR(monthlyPayment)}</span>
                  <span className="text-lg font-semibold text-white/90">€/lună</span>
                </div>
              </div>

              <div className="space-y-2.5 text-sm border-t border-white/20 pt-3">
                <div className="flex justify-between">
                  <span className="text-white/80">Suma solicitată</span>
                  <span className="font-semibold">{formatEUR(financedAmount)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Avans achitat</span>
                  <span className="font-semibold">{formatEUR(downPaymentEUR)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Total de plată</span>
                  <span className="font-semibold">{formatEUR(totalPayment)} €</span>
                </div>
                <div className="flex justify-between text-xs text-white/70 pt-2 border-t border-white/20">
                  <span>DAE orientativ</span>
                  <span>{(ANNUAL_INTEREST_RATE * 100).toFixed(0)}%</span>
                </div>
              </div>

              <p className="text-xs text-white/80 text-center border-t border-white/20 pt-3">
                * Calculul este orientativ. Rata finală depinde de evaluarea instituției financiare.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

  );
};

export default FinanceCalculator;
