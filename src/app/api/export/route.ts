import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("ld-session")?.value;
    if (!sessionUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch all relevant data
    const accounts = await prisma.account.findMany();
    const transactions = await prisma.transaction.findMany({
      include: { account: { select: { name: true } } },
      orderBy: { date: 'desc' }
    });
    const loans = await prisma.loan.findMany();
    const goals = await prisma.goal.findMany();

    // Transform data for Excel sheets
    const accountsData = accounts.map(a => ({
      'Account Name': a.name,
      'Bank': a.bankName || '',
      'Type': a.type,
      'Currency': a.currency,
      'Current Balance': a.balance,
      'Created At': a.createdAt.toISOString().split('T')[0]
    }));

    const transactionsData = transactions.map(t => ({
      'Date': t.date.toISOString().split('T')[0],
      'Type': t.type,
      'Amount': t.amount,
      'Currency': t.currency,
      'Amount (INR)': t.amountInINR,
      'Category': t.category,
      'Account': t.account.name,
      'Description': t.description || ''
    }));

    const loansData = loans.map(l => ({
      'Loan Name': l.name,
      'Lender': l.lender || '',
      'Principal': l.principalAmount,
      'Remaining Balance': l.currentBalance,
      'EMI Amount': l.emiAmount,
      'Interest Rate': l.interestRate ? `${l.interestRate}%` : '',
      'Status': l.isCleared ? 'Cleared' : 'Active'
    }));

    const goalsData = goals.map(g => ({
      'Goal Name': g.name,
      'Target Amount': g.targetAmount,
      'Current Saved': g.currentAmount,
      'Status': g.status
    }));

    // Create workbook and add sheets
    const wb = XLSX.utils.book_new();
    
    if (transactionsData.length > 0) {
      const wsTransactions = XLSX.utils.json_to_sheet(transactionsData);
      XLSX.utils.book_append_sheet(wb, wsTransactions, "Transactions");
    }
    
    if (accountsData.length > 0) {
      const wsAccounts = XLSX.utils.json_to_sheet(accountsData);
      XLSX.utils.book_append_sheet(wb, wsAccounts, "Accounts");
    }
    
    if (loansData.length > 0) {
      const wsLoans = XLSX.utils.json_to_sheet(loansData);
      XLSX.utils.book_append_sheet(wb, wsLoans, "Loans");
    }
    
    if (goalsData.length > 0) {
      const wsGoals = XLSX.utils.json_to_sheet(goalsData);
      XLSX.utils.book_append_sheet(wb, wsGoals, "Goals");
    }

    // Default sheet if db is empty
    if (wb.SheetNames.length === 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{ Message: "No data found" }]), "Empty");
    }

    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Return as downloadable file
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="life_dashboard_backup.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
